function setBackgroundColorByProject(project) {
  return {
    "project-dga": project === "DGA",
    "project-dia": project === "61c122ac-ea86-5462-8bab-6b86138c49b2" || project === "928f5e0d-53e3-5f53-b9c2-5af389c30dd4",
    "project-dba": project === "BAR",
    "project-sh": project === "AWE",
    "project-galleries": project === "GALLERIES",
    "project-dca": project === "DCA",
    // EXH: isExhibition,
  };
}

export { setBackgroundColorByProject };
