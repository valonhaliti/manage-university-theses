import asyncHandler from '../utils/asyncHandler';
import '@babel/polyfill';
import thesis from '../model/thesis';
import stringSimilarity from 'string-similarity';
import maxBy from 'lodash/maxBy'
import similarityReportModel from '../model/similarityReport';


export const compareThesisWithAll = asyncHandler(async (req, res, next)  => {
  const { thesisId } = req.params;
  let abstract = await thesis.get(thesisId);
  abstract = abstract[0].description;

  const otherTheses = await thesis.getAllThesesExcluding(thesisId);
  const otherThesesAbstract = otherTheses.map(thesis => thesis.description);
  
  let { ratings, bestMatch } = stringSimilarity.findBestMatch(abstract, otherThesesAbstract);

  ratings = ratings.map((rating, idx) => Object.assign(rating, { id: otherTheses[idx].id, title: otherTheses[idx].title }))

  similarityReportModel.createOrUpdate({
    thesis_id: thesisId,
    ratings: JSON.stringify(ratings),
    best_match: JSON.stringify(bestMatch),
    last_modified_date: new Date()
  });

  return res.status(200).json({
    ratings, bestMatch
  });
});
