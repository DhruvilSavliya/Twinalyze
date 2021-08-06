export default {
  getRecentSearches: (userId) => {
    return {
      url: `/tweet/getAnalysisByUser/${userId}`,
      method: "get",
    };
  },
  getTweetReportByAnalysisId: (analysisId) => {
    return {
      url: `/tweet/getTweetReportByAnalysisId/${analysisId}`,
      method: "get",
    };
  },
  startAnalysis: () => {
    return {
      url: `/tweet/startAnalysis`,
      method: "post",
    };
  },
};
