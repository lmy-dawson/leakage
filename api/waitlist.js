import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        return handlePostRequest(req, res);
    }

    if (req.method === 'GET') {
        return handleGetRequest(req, res);
    }

    res.status(405).json({ error: 'Method not allowed' });
}

async function handlePostRequest(req, res) {
    try {
        const { email } = req.body;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Check if email already exists
        const { data: existingEmail, error: checkError } = await supabase
            .from('waitlist')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking email:', checkError);
            return res.status(500).json({ error: 'Server error' });
        }

        if (existingEmail) {
            return res.status(400).json({ error: 'Email already on waitlist' });
        }

        // Add new email
        const { data, error } = await supabase
            .from('waitlist')
            .insert([
                {
                    email: email.toLowerCase(),
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Error inserting email:', error);
            return res.status(500).json({ error: 'Failed to add email' });
        }

        res.status(200).json({ success: true, message: 'Email added to waitlist' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function handleGetRequest(req, res) {
    try {
        const { data, error } = await supabase
            .from('waitlist')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching emails:', error);
            return res.status(500).json({ error: 'Server error' });
        }

        res.status(200).json({ emails: data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
