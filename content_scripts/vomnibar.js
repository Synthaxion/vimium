//
// This wraps the vomnibar iframe, which we inject into the page to provide the vomnibar.
//
const Vomnibar = {
  vomnibarUI: null,

  // sourceFrameId here (and below) is the ID of the frame from which this request originates, which
  // may be different from the current frame.

  activate(sourceFrameId, registryEntry) {
    const options = Object.assign({}, registryEntry.options, { completer: "omni" });
    this.open(sourceFrameId, options);
  },

  activateInNewTab(sourceFrameId, registryEntry) {
    const options = Object.assign({}, registryEntry.options, { completer: "omni", newTab: true });
    this.open(sourceFrameId, options);
  },

  activateTabSelection(sourceFrameId) {
    this.open(sourceFrameId, {
      completer: "tabs",
      selectFirst: true,
    });
  },

  activateBookmarks(sourceFrameId, registryEntry) {
    const options = Object.assign({}, registryEntry.options, {
      completer: "bookmarks",
      selectFirst: true,
    });
    this.open(sourceFrameId, options);
  },

  activateBookmarksInNewTab(sourceFrameId, registryEntry) {
    const options = Object.assign({}, registryEntry.options, {
      completer: "bookmarks",
      selectFirst: true,
      newTab: true,
    });
    this.open(sourceFrameId, options);
  },

  activateEditUrl(sourceFrameId) {
    this.open(sourceFrameId, {
      completer: "omni",
      selectFirst: false,
      query: globalThis.location.href,
    });
  },

  activateEditUrlInNewTab(sourceFrameId) {
    this.open(sourceFrameId, {
      completer: "omni",
      selectFirst: false,
      query: globalThis.location.href,
      newTab: true,
    });
  },
  // Look into the trace of the calling of this function
  // to add the function to add a tab to a group
  // https://developer.chrome.com/docs/extensions/reference/api/tabGroups
  // https://developer.chrome.com/docs/extensions/reference/api/tabs#method-group
  // lets use ^ that function, and use the call back to get the group id
  // then change the name and color wuuuuuuuuuuu
  // after that, lets use the vomnibar to set a name, and show already existing
  // groups!
  addToGroup(sourceFrameId) {
    // this.open(sourceFrameId, {
    //   completer: "omni",
    //   selectFirst: false,
    //   query: globalThis.location.href,
    //   newTab: true,
    // });
    // since we can't access tab groups from here maybe we need to use a popup script
    console.log("sending msg");
    chrome.runtime.sendMessage({
      handler: "addToGroup",
      tabName: "some tab name"
    }, (res) => {
      console.log("received");
      console.log(res);
    });
    console.log(sourceFrameId);
  },

  init() {
    if (!this.vomnibarUI) {
      this.vomnibarUI = new UIComponent();
      this.vomnibarUI.load("pages/vomnibar_page.html", "vomnibar-frame");
    }
  },

  // Opens the vomnibar.
  // - vomnibarShowOptions:
  //     completer: The name of the completer to fetch results from.
  //     query: Optional. Text to prefill the Vomnibar with.
  //     selectFirst: Optional. Whether to select the first entry.
  //     newTab: Optional. Whether to open the result in a new tab.
  //     keyword: A keyword which will scope the search to a UserSearchEngine.
  open(sourceFrameId, vomnibarShowOptions) {
    this.init();
    // The Vomnibar cannot coexist with the help dialog (it causes focus issues).
    HelpDialog.abort();
    Utils.assertType(VomnibarShowOptions, vomnibarShowOptions);
    this.vomnibarUI.show(
      Object.assign(vomnibarShowOptions, { name: "activate" }),
      { sourceFrameId, focus: true },
    );
  },
};

globalThis.Vomnibar = Vomnibar;
