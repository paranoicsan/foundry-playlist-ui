const PLCR = this.PLCR || {};

class PlaylistControllerInitializer {
    constructor() { }

    static initialize() {
        PlaylistControllerInitializer.hookReady();
        PlaylistControllerInitializer.hookRenderPlaylistSearch();
    }

    static hookRenderPlaylistSearch() {
        /**
         * Appends a search bar onto the playlist screen for finding songs easily
         */
        Hooks.on("renderPlaylistDirectory", (app, html, data) => {
            const searchString = game.i18n.localize("PLCR.Search");
            const searchField = $(`<input type="text" placeholder="${searchString}" style="color: white; max-width: 96%; margin: 10px 0px;" />`);
            html.find(".directory-header").append(searchField)
            searchField.keyup(debounce(function(ev) {
                PLCR.playlistController.search(ev.target.value).then(function(result) {
                    if (typeof result != 'undefined') {
                        console.log('PLCR | Found ' + result.length + ' results.');
                    } else {
                        console.log('PLCR | Found 0 results.');
                    }
                }, function(err) {
                    console.log(err);
                });
            }));
        });
    }

    static hookReady() {
        Hooks.on("ready", () => {
            PLCR.playlistController = new PlaylistController();
            // TO-DO: Register all settings
        });
    }
}

class PlaylistController {
    constructor() {
        this.directoryItemSelector = '#playlists .directory-item:not(.global-volume)';
        this.playlistSelector = '#playlists .playlist:not(.collapsed):not(.global-volume)';
    }

    async search(searchString) {
        if (searchString.length > 3) {
            let collection = $(this.directoryItemSelector + ` .sound-name:contains(${searchString}):not(selector)`);
            if(collection.length > 0) {
                $(this.directoryItemSelector + ` .sound`).hide();
                collection.each(function() {
                    $(this).parent().show();
                    $(this).parents('.playlist-sounds').show();
                    $(this).parents('.playlist').removeClass('collapsed');
                });

                return collection;
            }
        } else {
            $(this.directoryItemSelector + ` .sound`).show();
            $(this.playlistSelector + ` .playlist-sounds`).hide();
            $(this.playlistSelector).addClass('collapsed');
        }
    }
}

PlaylistControllerInitializer.initialize();