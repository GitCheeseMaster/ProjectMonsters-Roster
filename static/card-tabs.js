/* Compact roster-card tabs. Kept dependency-free and isolated so the static
   site retains its no-framework architecture. */

(() => {
  for (const detail of document.querySelectorAll(".monster-card-details")) {
    const tabs = Array.from(detail.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    const selectTab = (selectedTab, moveFocus) => {
      tabs.forEach((tab, index) => {
        const selected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[index].hidden = !selected;
      });
      if (moveFocus) selectedTab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectTab(tab, false));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowLeft") nextIndex = (index + tabs.length - 1) % tabs.length;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex === null) return;

        event.preventDefault();
        selectTab(tabs[nextIndex], true);
      });
    });
  }
})();
