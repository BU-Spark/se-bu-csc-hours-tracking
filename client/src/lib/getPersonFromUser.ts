export async function getPersonFromUser(clerkId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL('/api/get-person', baseUrl);
    url.searchParams.append('clerk_id', clerkId);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.person || null;
  } catch (error) {
    return null;
  }
}