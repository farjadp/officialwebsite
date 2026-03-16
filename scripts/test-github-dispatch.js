require('dotenv').config({ path: '.env.vercel.prod' });

async function testGitHubDispatch() {
    const pat = process.env.GITHUB_PAT;
    console.log("Using PAT:", pat ? pat.substring(0, 10) + "..." : "Missing");

    const response = await fetch('https://api.github.com/repos/farjadp/officialwebsite/dispatches', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${pat}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Node-Fetch-Test'
        },
        body: JSON.stringify({
            event_type: 'trigger-backup',
            client_payload: { type: 'full' }
        })
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.error('GitHub API error:', response.status, errBody);
    } else {
        console.log('Success! GitHub returned:', response.status);
    }
}

testGitHubDispatch().catch(console.error);
