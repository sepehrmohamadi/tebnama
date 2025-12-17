const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to generate MD5 hash of email
function hashEmail(email) {
  return crypto.createHash('md5').update(email).digest('hex');
}

// Function to generate random ID
function generateId() {
  return crypto.randomUUID();
}

// Function to get current timestamp
function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}

// Function to create a review file
function createReview(reviewData, companySlug) {
  // Ensure the directory exists
  const dirPath = path.join('_data', 'review', companySlug);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Generate filename
  const fileName = `entry${Math.floor(Math.random() * 1000000000000)}.yml`;
  const filePath = path.join(dirPath, fileName);
  
  // Hash the email if provided
  const hashedEmail = reviewData.email ? hashEmail(reviewData.email) : '';
  
  // Prepare the YAML content
  const yamlContent = `\
_id: ${generateId()}
email: ${hashedEmail}
job_name: "${reviewData.job_name}"
rate: ${reviewData.rate}
state: "${reviewData.state}"
agent: "${reviewData.agent}"
description: |
  ${reviewData.description.replace(/\n/g, '\n  ')}
pros: "${reviewData.pros}"
cons: "${reviewData.cons}"
date: ${getCurrentTimestamp()}
`;
  
  // Write to file
  fs.writeFileSync(filePath, yamlContent);
  console.log(`Review created at: ${filePath}`);
}

// Example usage
const sampleReview = {
  email: "user@example.com",
  job_name: "بیمار",
  rate: 4.5,
  state: "نامشخص",
  agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  description: `تجربه بسیار خوبی داشتم. پزشک بسیار متخصص و مهربان بودند.
اطلاعات دقیقی درباره وضعیت سلامتم دادند و راهنمایی‌های لازم را ارائه کردند.
زمان‌بندی مناسب و فضای آرامی برای ویزیت وجود داشت.`,
  pros: "متخصص,مهربان,زمان‌بندی مناسب,تجهیزات مدرن",
  cons: "هزینه بالا,زمان انتظار طولانی"
};

// Uncomment the following line to create a sample review
// createReview(sampleReview, "دکتر-احمد-محمدی");

module.exports = { createReview, hashEmail };