$(document).ready(function() {
    $("#btn_verify_url").on("click", function() {
        validateUrl($("#url_input").val().trim());
    });

    $("#btn_test_connection").on("click", function() {
        testConnection();
    });

    $("#btn_generate_report").on("click", function() {
        generateReport();
    });
});

let reportData = {
    urlPassed: null,
    apiStatus: null,
    statsStatus: null,
    tokenHealth: null,
    issues: []
};

function validDomain(urlObj) {
    if (urlObj.hostname === "pixelplush.dev" || urlObj.hostname.endsWith(".pixelplush.dev")) return true;
    if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") return true;
    return false;
}

function updateChecklist(id, passed) {
    let el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("bx-square", "bx-check-square", "bx-error-circle", "bx-x-circle", "text-muted", "text-success", "text-danger");
    if (passed) {
        el.classList.add("bx-check-square", "text-success");
    } else {
        el.classList.add("bx-x-circle", "text-danger");
    }
}

async function validateUrl(urlStr) {
    reportData.urlPassed = false;
    reportData.issues = [];
    $("#url_results").html("");
    
    if (!urlStr) {
        $("#url_results").html(`<div class="alert alert-danger bg-danger text-white">Please enter a valid URL.</div>`);
        return;
    }

    let urlObj;
    try {
        urlObj = new URL(urlStr);
    } catch(e) {
        $("#url_results").html(`<div class="alert alert-danger bg-danger text-white">Invalid URL format.</div>`);
        return;
    }
    
    let isHttps = urlObj.protocol === "https:";
    let isPixelPlush = validDomain(urlObj);
    let params = new URLSearchParams(urlObj.search);
    let channel = params.get("channel");
    let oauth = params.get("oauth") || params.get("token") || params.get("twitch");

    let resultsHtml = `<ul class="list-group">`;

    if (isPixelPlush) {
        resultsHtml += `<li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> Valid game URL (${urlObj.hostname})</li>`;
    } else {
        resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> Unrecognized domain (${urlObj.hostname})</li>`;
        reportData.issues.push("Unrecognized domain");
    }

    if (isHttps) {
        resultsHtml += `<li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> Using HTTPS</li>`;
    } else {
        resultsHtml += `<li class="list-group-item list-group-item-warning"><i class="bx bx-error"></i> Not using HTTPS (Recommended)</li>`;
        reportData.issues.push("Using HTTP instead of HTTPS");
    }
    updateChecklist("chk_https", isHttps);

    if (channel) {
        resultsHtml += `<li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> Channel parameter present (${channel})</li>`;
    } else {
        resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> Channel parameter missing</li>`;
        reportData.issues.push("Channel parameter missing in URL");
    }
    updateChecklist("chk_channel", !!channel);

    if (oauth) {
        resultsHtml += `<li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> OAuth token present (masked)</li>`;
        validateToken(oauth);
    } else {
        resultsHtml += `<li class="list-group-item list-group-item-warning"><i class="bx bx-error"></i> OAuth token missing in URL</li>`;
        reportData.issues.push("OAuth token missing in URL");
    }
    updateChecklist("chk_token", !!oauth);
    
    let theme = params.get("theme");
    if(theme) {
        resultsHtml += `<li class="list-group-item list-group-item-info"><i class="bx bx-info-circle"></i> Theme: ${theme}</li>`;
    }
    
    resultsHtml += `</ul>`;
    $("#url_results").html(resultsHtml);
    reportData.urlPassed = isPixelPlush && channel;
}

async function testConnection() {
    reportData.apiStatus = "Testing...";
    reportData.statsStatus = "Testing...";
    $("#connection_results").html(`<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>`);
    
    let resultsHtml = `<ul class="list-group">`;
    
    // API
    try {
        let t1 = Date.now();
        let apiRes = await fetch("https://api.pixelplush.dev/v1/status");
        let t2 = Date.now();
        if(apiRes.ok) {
            resultsHtml += `<li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> API Connection Successful (${t2-t1}ms)</li>`;
            reportData.apiStatus = `Success (${t2-t1}ms)`;
        } else {
            resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> API returned status ${apiRes.status}</li>`;
            reportData.apiStatus = `Failed (${apiRes.status})`;
            reportData.issues.push(`API Error ${apiRes.status}`);
        }
    } catch(e) {
        resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> API Connection Failed</li>`;
        reportData.apiStatus = "Failed";
        reportData.issues.push("API Connection Failed");
    }

    // Stats
    try {
        let t1 = Date.now();
        let statsRes = await fetch("https://stats.pixelplush.dev/v1/status");
        let t2 = Date.now();
        if(statsRes.ok) {
            resultsHtml += `<li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> Stats Connection Successful (${t2-t1}ms)</li>`;
            reportData.statsStatus = `Success (${t2-t1}ms)`;
        } else {
            resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> Stats returned status ${statsRes.status}</li>`;
            reportData.statsStatus = `Failed (${statsRes.status})`;
            reportData.issues.push(`Stats Error ${statsRes.status}`);
        }
    } catch(e) {
        resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> Stats Connection Failed</li>`;
        reportData.statsStatus = "Failed";
        reportData.issues.push("Stats Connection Failed");
    }
    
    // Ping
    try {
        let t1 = Date.now();
        let pingRes = await fetch("https://api.pixelplush.dev/ping");
        let t2 = Date.now();
        if(pingRes.ok) {
            resultsHtml += `<li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> Ping Successful (${t2-t1}ms)</li>`;
        } else {
            resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> Ping returned status ${pingRes.status}</li>`;
            reportData.issues.push(`Ping Error ${pingRes.status}`);
        }
    } catch(e) {
        resultsHtml += `<li class="list-group-item list-group-item-danger"><i class="bx bx-x"></i> Ping Connection Failed</li>`;
        reportData.issues.push("Ping Connection Failed");
    }

    resultsHtml += `</ul>`;
    $("#connection_results").html(resultsHtml);
}

async function validateToken(token) {
    if(!token) return;
    
    // Strip "oauth:" if present for the validation request to Twitch
    let rawToken = token;
    if(rawToken.startsWith("oauth:")) {
        rawToken = rawToken.substring(6);
    }
    
    reportData.tokenHealth = "Testing...";
    $("#token_results").html(`<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>`);
    
    try {
        let res = await fetch("https://id.twitch.tv/oauth2/validate", {
            headers: {
                "Authorization": `OAuth ${rawToken}`
            }
        });
        
        let data = await res.json();
        if(res.ok && data.client_id) {
            let expiresStr = data.expires_in ? `${Math.round(data.expires_in / 86400)} days` : "Unknown";
            let resultsHtml = `<ul class="list-group">
                <li class="list-group-item list-group-item-success"><i class="bx bx-check"></i> Token Valid</li>
                <li class="list-group-item list-group-item-info"><i class="bx bx-user"></i> Associated User: ${data.login}</li>
                <li class="list-group-item list-group-item-info"><i class="bx bx-time"></i> Expires In: ${expiresStr}</li>
                <li class="list-group-item list-group-item-info"><i class="bx bx-list-ul"></i> Scopes: ${(data.scopes || []).join(", ") || "None"}</li>
            </ul>`;
            $("#token_results").html(resultsHtml);
            reportData.tokenHealth = "Valid";
        } else {
            $("#token_results").html(`<div class="alert alert-danger bg-danger text-white"><i class="bx bx-x"></i> Token is Invalid or Expired</div>`);
            reportData.tokenHealth = "Invalid";
            reportData.issues.push("OAuth token is invalid or expired");
        }
    } catch(e) {
        $("#token_results").html(`<div class="alert alert-danger bg-danger text-white"><i class="bx bx-x"></i> Failed to validate token</div>`);
        reportData.tokenHealth = "Failed to Validate";
        reportData.issues.push("Failed to validate OAuth token against Twitch API");
    }
}

function generateReport() {
    let checkedItems = Array.from(document.querySelectorAll("#checklist .bx-check-square")).length;
    let totalItems = Array.from(document.querySelectorAll("#checklist .bx-square, #checklist .bx-check-square, #checklist .bx-x-circle, #checklist .bx-error-circle")).length;
    
    let reportText = `PixelPlush Troubleshoot Report
================================
Date: ${new Date().toISOString()}
URL Check: ${reportData.urlPassed === null ? "Not run" : (reportData.urlPassed ? "Passed" : "Failed")}
API Status: ${reportData.apiStatus || "Not run"}
Stats Status: ${reportData.statsStatus || "Not run"}  
Token: ${reportData.tokenHealth || "Not run"}
Checklist: ${checkedItems} items checked / ${totalItems} total
Issues Found: ${reportData.issues.length > 0 ? reportData.issues.join(", ") : "None"}`;

    // Copy to clipboard
    navigator.clipboard.writeText(reportText).then(() => {
        alert("Report copied to clipboard!");
    }).catch(err => {
        alert("Failed to copy report. Check console for details.");
        console.error(reportText);
    });
}