async function run() {
  try {
    const response = await fetch('http://localhost:3000/api/plans/2', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre_plan: 'Plan Premium' })
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

run();
