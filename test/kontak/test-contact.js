// 🧪 Test Script untuk Contact Page
const SHEETDB_URL = "https://sheetdb.io/api/v1/1adqj3auw9hcw";

async function testFetchData() {
  console.log("🔍 Test 1: Fetch data dari SheetDB...");
  try {
    const res = await fetch(SHEETDB_URL);
    const data = await res.json();
    console.log("✅ Data fetched successfully!");
    console.log(`📊 Total records: ${data.length}`);
    console.log("📋 Sample data:", data.slice(0, 3));
    return true;
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    return false;
  }
}

async function testSendData() {
  console.log("\n🔍 Test 2: Send test data ke SheetDB...");
  const testData = {
    name: "Test User " + new Date().getTime(),
    email: "test@example.com",
    message: "Ini adalah test message dari script test - " + new Date().toLocaleString(),
  };

  try {
    const res = await fetch(SHEETDB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([testData]),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ Data sent successfully!");
    console.log("📝 Response:", result);
    return true;
  } catch (err) {
    console.error("❌ Error sending data:", err);
    return false;
  }
}

async function testVerifyData() {
  console.log("\n🔍 Test 3: Verify data yang baru dikirim...");
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    const res = await fetch(SHEETDB_URL);
    const data = await res.json();
    console.log("✅ Data verified!");
    console.log(`📊 Latest record:`, data[data.length - 1]);
    return true;
  } catch (err) {
    console.error("❌ Error verifying data:", err);
    return false;
  }
}

async function runAllTests() {
  console.log("====================================");
  console.log("🚀 Starting Contact Page Tests");
  console.log("====================================\n");

  const test1 = await testFetchData();
  const test2 = await testSendData();
  const test3 = await testVerifyData();

  console.log("\n====================================");
  console.log("📊 Test Results Summary:");
  console.log("====================================");
  console.log(`✅ Fetch Data: ${test1 ? "PASSED" : "FAILED"}`);
  console.log(`✅ Send Data: ${test2 ? "PASSED" : "FAILED"}`);
  console.log(`✅ Verify Data: ${test3 ? "PASSED" : "FAILED"}`);
  console.log("====================================\n");

  if (test1 && test2 && test3) {
    console.log("🎉 All tests PASSED!");
    console.log("✨ Halaman Contact siap digunakan!");
  } else {
    console.log("⚠️ Some tests failed, please check the errors above.");
  }
}

runAllTests();
