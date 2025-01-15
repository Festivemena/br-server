function calculateAmount(initialAmount, rate, lastAmount) {
    // Check if rate is 0, in which case lastAmount remains unchanged
    if (rate === 0) {
      return lastAmount;
    }
  
    // Calculate the new amount based on the rate
    const increaseAmount = initialAmount * (rate / 100);
    const newAmount = initialAmount + increaseAmount;
  
    // Update lastAmount with the new amount
    const updatedLastAmount = lastAmount + newAmount;
  
    return updatedLastAmount;
  }
  
  // Example usage:
  const initialAmount = 1000; // Replace with your initial amount
  let rate = 5; // Replace with your rate
  let lastAmount = 0; // Replace with your last amount
  
  // First calculation
  lastAmount = calculateAmount(initialAmount, rate, lastAmount);
  console.log("Updated Last Amount:", lastAmount);
  
  // Change rate
  rate = 10;
  
  // Second calculation with the new rate
  lastAmount = calculateAmount(initialAmount, rate, lastAmount);
  console.log("Updated Last Amount:", lastAmount);
  
  // If rate is changed to 0, lastAmount remains unchanged
  rate = 0;
  lastAmount = calculateAmount(initialAmount, rate, lastAmount);
  console.log("Updated Last Amount:", lastAmount);
  