import asyncHandler from '../utils/asyncHandler';
import '@babel/polyfill';
import thesis from '../model/thesis';
import stringSimilarity from 'string-similarity';
import sortBy from 'lodash/sortBy';
import similarityReportModel from '../model/similarityReport';

export const compareThesisWithAll = asyncHandler(async (req, res, next)  => {
  const { thesisId } = req.params;

  const allTheses = await thesis.list();
  
  const thesisIdxArr = allTheses.findIndex(obj => obj.id === Number(thesisId));
  const thesisAbstract = allTheses.splice(thesisIdxArr, 1)[0].description;

  const otherThesesAbstract = allTheses.map(thesis => thesis.description); // actually now allTheses contains all OTHER theses

  let { ratings, bestMatch } = stringSimilarity.findBestMatch(thesisAbstract, otherThesesAbstract);

  ratings = ratings.map((rating, idx) => Object.assign(rating, { id: allTheses[idx].id, title: allTheses[idx].title }));
  ratings = sortBy(ratings, 'rating');

  const top3Ratings = ratings.length < 3 ? ratings : ratings.slice(ratings.length - 3);
  const final3 = [];
  for (let i = top3Ratings.length - 1; i >= 0; i--) {
    final3.push(top3Ratings[i])
  }

  similarityReportModel.createOrUpdate({
    thesis_id: thesisId,
    ratings: JSON.stringify(final3), // we want to save only the best three ratings in database
    best_match: JSON.stringify(bestMatch),
    last_modified_date: new Date()
  });

  return res.status(200).json({
    ratings, bestMatch
  });
});

export const getSimilarity = asyncHandler(async (req, res, next) => {
  const { thesisId } = req.params;

  const response = await similarityReportModel.get(thesisId);
  return res.status(200).json({
    data: response
  })
});
