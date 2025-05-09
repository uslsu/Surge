/**
 * Clear Surge DNS Cache (TF Compatible)
 * - Clears DNS cache using HTTP API (/v1/dns/flush).
 * - Updates panel with DNS delay information.
 */
!(async () => {
    let panel = { title: "DNS Flush" };
    if (typeof $argument != "undefined") {
        let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));
        if (arg.title) panel.title = arg.title;
        if (arg.icon) panel.icon = arg.icon;
        if (arg.color) panel["icon-color"] = arg.color;
    }
    if ($trigger == "button") {
        await httpAPI("/v1/dns/flush");
        $notification.post(panel.title, "", "DNS cache cleared successfully.");
    }
    let delay = ((await httpAPI("/v1/test/dns_delay")).delay * 1000).toFixed(0);
    panel.content = `DNS延迟: ${delay}ms`;
    $done(panel);
})();

function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}
