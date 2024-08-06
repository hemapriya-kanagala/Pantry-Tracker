import getRecipe from '../../server/getRecipe';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const recipe = await getRecipe(prompt);
    return new Response(JSON.stringify(recipe), { status: 200 });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return new Response(JSON.stringify({ error: 'Error generating recipe' }), { status: 500 });
  }
}
