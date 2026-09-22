function setBackgroundColorByProject(project) {
  return {
    "project-dga": project === "DGA",
    "project-dia": project === "ISL" || project === "EPM",
    "project-dba": project === "BAR",
    "project-sh": project === "AWE",
    "project-galleries": project === "GALLERIES",
    "project-dca": project === "DCA",
    // EXH: isExhibition,
  };
}

export { setBackgroundColorByProject };
