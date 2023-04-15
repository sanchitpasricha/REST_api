exports.getOverview = (req, res) => {
  res.status(200).render("overview", {
    title: "All tours",
  });
};

exports.getTours = (req, res) => {
  res.status(200).render("tour", {
    title: "The Forest Hicker",
  });
};
