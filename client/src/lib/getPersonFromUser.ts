export async function getPersonFromUser(clerkId: string) {
  try {
    console.log('getPersonFromUser called from:', new Error().stack?.split('\n')[2].trim());
    console.log(`Fetching person data for clerk_id: ${clerkId}`);
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL('/api/get-person', baseUrl);
    url.searchParams.append('clerk_id', clerkId);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.person || null;
  } catch (error) {
    console.error(`When called from ${new Error().stack?.split("\n")[2].trim()}, Error fetching person data:`, error);
    return null;
  }
}