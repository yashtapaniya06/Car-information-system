(async ()=>{
  const urls = [
    'http://localhost:5000/cars',
    'http://localhost:5000/cars/1',
    'http://localhost:5000/featured',
    'http://localhost:5000/users',
    'http://localhost:5000/contacts'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u);
      console.log('===', u, '===');
      console.log('Status', res.status);
      const text = await res.text();
      console.log(text.slice(0, 800));
    } catch (e) {
      console.error('Error fetching', u, e.message);
    }
  }
})();

