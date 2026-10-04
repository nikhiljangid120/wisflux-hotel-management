async function testHold() {
  try {
    const res = await fetch('http://localhost:3000/bookings/hold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestId: 1, // assuming guest 1 exists, or I can create one
        roomTypeId: 5,
        checkIn: "2026-06-20",
        checkOut: "2026-06-22"
      })
    });
    const data = await res.json();
    console.log("Hold Result:", data);
  } catch(e) {
    console.error(e);
  }
}
testHold();
