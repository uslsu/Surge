/**
 * Clear Surge DNS Cache
 * - Clears Surge's DNS cache using $surge.clearDNSCache().
 * - Sends a notification with customizable title.
 * - Includes error handling and logging for robustness.
 */
/**
 * Clear Surge DNS Cache
 * - Checks if $surge.clearDNSCache() is available before execution.
 * - Provides error notification if API is unsupported.
 */
if (typeof $surge.clearDNSCache === 'function') {
    $surge.clearDNSCache();
    $notification.post("Flush DNS Cache", "", "DNS cache cleared successfully.");
} else {
    $notification.post("DNS Cache Error", "", "This Surge version does not support DNS cache clearing. Please update Surge to 5.8 or later.");
}
$done();

try {
    // Parse only the 'title' parameter from $argument
    let title = "DNS Cache Cleared";
    if ($argument) {
        const match = $argument.match(/title=([^&]*)/);
        if (match && match[1]) {
            title = decodeURIComponent(match[1]);
        }
    }

    // Clear DNS cache
    $surge.clearDNSCache();

    // Send success notification
    $notification.post(title, "", "Surge DNS cache has been successfully cleared.");
    console.log("DNS cache cleared successfully");
} catch (error) {
    // Handle errors (e.g., API failure or Surge version incompatibility)
    $notification.post("DNS Cache Error", "", `Failed to clear DNS cache: ${error.message}`);
    console.log(`Error clearing DNS cache: ${error.message}`);
}

// Complete script execution
$done();
