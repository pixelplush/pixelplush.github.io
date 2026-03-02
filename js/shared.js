// shared.js - Common code for PixelPlush pages
// Created: July 12, 2025

// Common constants
const PLUSH = {
    clientId: "8m07ghhogjy0q09moeunnpdu51i60n",
    baseUrl: window.location.origin,
    apiUrl: "https://api.pixelplush.dev/v1",
    scoreUrl: "https://stats.pixelplush.dev/v1",
    params: new URLSearchParams(location.search)
};

// Authentication and account management
const PlushAuth = {
    account: {},
    twitchToken: null,

    // Initialize authentication
    init: function() {
        // Set up UI defaults
        $(".not-logged-in").show();
        $(".logged-in").hide();
        $(".additional-permissions").hide();

        // Configure ComfyTwitch endpoints
        ComfyTwitch.SetAuthEndpoint(`${PLUSH.scoreUrl}/auth/code`);
        ComfyTwitch.SetRefreshEndpoint(`${PLUSH.scoreUrl}/auth/refresh`);

        // Set up logout handler
        $(document).on("click", ".logout", function() {
            ComfyTwitch.Logout();
            window.location.reload();
        });

        // Return promise for chaining
        return this.check();
    },

    // Check authentication status
    check: function() {
        return ComfyTwitch.Check()
            .then(async result => {
                if (result) {
                    try {
                        this.twitchToken = result.token;
                        
                        // Fetch account info
                        this.account = await fetch(`${PLUSH.scoreUrl}/accounts`, {
                            headers: {
                                Twitch: result.token
                            }
                        }).then(r => r.json());

                        // For backward compatibility
                        account = this.account;
                        twitch = result;

                        if (this.account.error) {
                            throw "Login Error";
                        }

                        // Update UI with account info
                        $(".not-logged-in").hide();
                        $(".logged-in").show();
                        $(".account-image").attr("src", this.account.profileImage);
                        $(".user-name").text(this.account.displayName || this.account.username);
                        $(".user-coins").text(this.account.coins);

                        return {
                            authenticated: true,
                            account: this.account,
                            token: this.twitchToken,
                            login: result.login
                        };
                    }
                    catch (error) {
                        console.log("Auth Validate Failed", error);
                        return { authenticated: false, error };
                    }
                }
                else {
                    $(".not-logged-in").show();
                    $(".logged-in").hide();
                    return { authenticated: false };
                }
            });
    },

    // Fetch catalog data
    fetchCatalog: async function() {
        const catalog = await fetch("https://www.pixelplush.dev/assets/catalog.json").then(r => r.json());
        const items = {};
        
        catalog.forEach(x => {
            items[x.id] = x;
        });
        
        return { catalog, items };
    },

    // Fetch user transactions
    fetchTransactions: async function() {
        if (!this.twitchToken) {
            throw new Error("Not authenticated");
        }

        return fetch(`${PLUSH.scoreUrl}/transactions/user`, {
            headers: {
                Twitch: this.twitchToken
            }
        }).then(r => r.json());
    }
};

// Helper functions
const PlushHelpers = {
    // Format date using moment.js
    formatDate: function(date, format = "llll") {
        return moment(date).format(format);
    },
    
    // Get parameter from URL
    getParam: function(name, defaultValue = null) {
        return PLUSH.params.get(name) || defaultValue;
    }
};

// Declare global variables for backward compatibility
let params = PLUSH.params;
let clientId = PLUSH.clientId;
let baseUrl = PLUSH.baseUrl;
let plushApiUrl = PLUSH.apiUrl;
let plushScoreUrl = PLUSH.scoreUrl;
let twitch = {};
let account = {};
