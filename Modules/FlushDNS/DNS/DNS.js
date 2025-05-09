let args = $argument.split('&').reduce((acc, curr) => {
    let [key, value] = curr.split('=');
    acc[key] = value;
    return acc;
}, {});

$surge.clearDNSCache();
$notification.post(args.title || "DNS Cache Cleared", "", "Surge DNS cache has been successfully cleared.");
$done();
