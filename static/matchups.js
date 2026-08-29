/* Roster matchup-map filtering and focus.  The graph and all relationship
   data are generated at build time; this only changes presentation. */

(() => {
  for (const map of document.querySelectorAll(".matchup-map")) {
    const edges = Array.from(map.querySelectorAll(".matchup-edge"));
    const rows = Array.from(map.querySelectorAll(".matchup-relationship-row"));
    const nodes = Array.from(map.querySelectorAll(".matchup-node"));
    const empty = map.querySelector(".matchup-filter-empty");
    const summary = map.querySelector(".matchup-focus-summary");
    const radios = Array.from(map.querySelectorAll('input[name="matchup-filter"]'));
    if (!empty) continue;

    const applyFilter = () => {
      const selected = radios.find((radio) => radio.checked)?.value || "all";
      let visibleEdges = 0;
      edges.forEach((edge) => {
        const visible = selected === "all" || edge.dataset.categories.split(" ").includes(selected);
        edge.toggleAttribute("hidden", !visible);
        const presentationCategory = selected === "all" ? edge.dataset.primary : selected;
        edge.classList.remove("matchup-edge-stab", "matchup-edge-coverage", "matchup-edge-authored");
        edge.classList.add(`matchup-edge-${presentationCategory}`);
        edge.setAttribute("marker-end", `url(#matchup-arrow-${presentationCategory})`);
        if (visible) visibleEdges += 1;
      });
      rows.forEach((row) => {
        row.toggleAttribute("hidden", selected !== "all" && !row.dataset.categories.split(" ").includes(selected));
      });
      empty.hidden = visibleEdges !== 0;
      empty.textContent = selected === "all" ? empty.dataset.emptyMap : empty.dataset.emptyFilter;
    };

    const focusNode = (node) => {
      const speciesId = node.dataset.speciesId;
      const outgoing = edges.filter((edge) => edge.dataset.source === speciesId).length;
      const incoming = edges.filter((edge) => edge.dataset.target === speciesId).length;
      nodes.forEach((other) => other.classList.toggle("is-unrelated", other !== node));
      edges.forEach((edge) => {
        edge.classList.toggle("is-outgoing", edge.dataset.source === speciesId);
        edge.classList.toggle("is-incoming", edge.dataset.target === speciesId);
        edge.classList.toggle("is-unrelated", edge.dataset.source !== speciesId && edge.dataset.target !== speciesId);
      });
      summary.textContent = `${node.textContent.trim()} — カウンターできる相手: ${outgoing} / カウンターされる相手: ${incoming}`;
    };

    const clearFocus = () => {
      nodes.forEach((node) => node.classList.remove("is-unrelated"));
      edges.forEach((edge) => edge.classList.remove("is-outgoing", "is-incoming", "is-unrelated"));
    };

    radios.forEach((radio) => radio.addEventListener("change", applyFilter));
    nodes.forEach((node) => {
      node.addEventListener("focus", () => focusNode(node));
      node.addEventListener("blur", clearFocus);
    });
    applyFilter();
  }
})();
