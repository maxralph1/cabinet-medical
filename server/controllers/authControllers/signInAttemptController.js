import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import { getYesterdayDateRange, 
        getTodayDateRange, 
        getPreviousWeekDateRange, 
        getCurrentWeekDateRange, 
        getPreviousMonthDateRange,
        getCurrentMonthDateRange, 
        getPreviousYearDateRange, 
        getCurrentYearDateRange } from '../../utils/date_range.js'; 
import SignInAttempt from '../../models/SignInAttempt.js'; 
import User from '../../models/User.js'; 






const getSignInAttempts = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const range = req?.query?.range 

    const skip = (current_page - 1) * limit; 

    // Importing Date Range Manipulation Functions
    const { yesterdayStart, yesterdayEnd } = getYesterdayDateRange(); 
    const { todayStart, todayEnd } = getTodayDateRange(); 
    const { lastWeekStart, lastWeekEnd } = getPreviousWeekDateRange()
    const { weekStart, weekEnd } = getCurrentWeekDateRange(); 
    const { lastMonthStart, lastMonthEnd } = getPreviousMonthDateRange();
    const { monthStart, monthEnd } = getCurrentMonthDateRange(); 
    const { lastYearStart, lastYearEnd } = getPreviousYearDateRange();
    const { yearStart, yearEnd } = getCurrentYearDateRange(); 
    // End of Importing Date Range Manipulation Functions 

    // Sign In Attempts Today
    const signInAttemptsTodayCount = await SignInAttempt.find({ deleted_at: null,
                                        created_at: { 
                                            $gte: todayStart, 
                                            $lte: todayEnd  
                                        }
                                    }).countDocuments(); 
    // End of Sign In Attempts Today

    let signInAttempts, signInAttemptsPreviousCount, signInAttemptsCount; 

    // Sign in Attempts 
    signInAttempts = await SignInAttempt.find({ deleted_at: null })
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .lean(); 

    if (!signInAttempts?.length) return res.status(404).json({ message: "No sign in attempts found!" }); 
    // End of Sign in Attempts

    // SignInAttempts Count
    if (range == 'today') { 
        signInAttemptsPreviousCount = await SignInAttempt.find({ deleted_at: null,
                                        created_at: { 
                                            $gte: yesterdayStart, 
                                            $lte: yesterdayEnd  
                                        }
                                    }).countDocuments(); 
        signInAttemptsCount = await SignInAttempt.find({ deleted_at: null,
                                        created_at: { 
                                            $gte: todayStart, 
                                            $lte: todayEnd  
                                        }
                                    }).countDocuments(); 
    } else if (range == 'week') {
        signInAttemptsPreviousCount = await SignInAttempt.find({ deleted_at: null,
                                        created_at: { 
                                            $gte: lastWeekStart, 
                                            $lte: lastWeekEnd  
                                        }
                                    }).countDocuments(); 
        signInAttemptsCount = await SignInAttempt.find({ deleted_at: null,
                                        created_at: { 
                                            $gte: weekStart, 
                                            $lte: weekEnd  
                                        }
                                    }).countDocuments(); 
    } else if (range == 'month') { 
        signInAttemptsPreviousCount = await SignInAttempt.find({ deleted_at: null,
                                        created_at: { 
                                            $gte: lastMonthStart, 
                                            $lte: lastMonthEnd  
                                        }
                                    }).countDocuments(); 
        signInAttemptsCount = await SignInAttempt.find({ deleted_at: null,
                                            created_at: {
                                                $gte: monthStart,
                                                $lte: monthEnd
                                            }
                                        }).countDocuments();
    } else if (range == 'year') { 
        signInAttemptsPreviousCount = await SignInAttempt.find({ deleted_at: null,
                                        created_at: { 
                                            $gte: lastYearStart, 
                                            $lte: lastYearEnd  
                                        }
                                    }).countDocuments(); 
        signInAttemptsCount = await SignInAttempt.find({ deleted_at: null,
                                            created_at: {
                                                $gte: yearStart,
                                                $lte: yearEnd
                                            }
                                        }).countDocuments();
    } else if (range == 'all') {
        signInAttemptsPreviousCount = 0;
        signInAttemptsCount = await SignInAttempt.find({ deleted_at: null }).countDocuments(); 
    } 
    // End SignInAttempts Count 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(signInAttemptsCount / limit), 
                    total_results: signInAttemptsCount, 
                    total_previous_results: signInAttemptsPreviousCount, 
                    total_today: signInAttemptsTodayCount
                }, 
                data: signInAttempts 
            }); 
}); 


const deleteSignInAttempt = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const signInAttempt = await SignInAttempt.findOne({ _id: id }).exec();

    if (!signInAttempt) return res.status(404).json({ message: `No sign in attempt matches the sign in attempt ${id}!` }); 

    if (signInAttempt.deleted_at == '') {
        signInAttempt.deleted_at = new Date().toISOString();
        signInAttempt.deleted_by = req?.user_id;
    }

    signInAttempt.save()
        .then(() => { 
			res.status(200).json({ success: `Sign in attempt record deleted.`, data: signInAttempt });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const restoreSignInAttempt = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const signInAttempt = await SignInAttempt.findOne({ _id: id }).exec();

    if (!signInAttempt) return res.status(404).json({ message: `No sign in attempt matches the sign in attempt ${id}!` }); 

    if (signInAttempt.deleted_at != '') {
        signInAttempt.deleted_at = '';
        signInAttempt.deleted_by = '';
    };

    signInAttempt.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted sign in attempt record restored.`, data: signInAttempt });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const destroySignInAttempt = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const signInAttempt = await SignInAttempt.findOne({ _id: id }).exec();

	if (!signInAttempt) return res.status(404).json({ message: `No sign in attempt matches the sign in attempt ${id}!` }); 

	await signInAttempt.deleteOne(); 

	res.status(200).json({ success: `Sign in attempt ${signInAttempt?.code} has been permanently deleted.`, data: `${signInAttempt}` });
}); 




export { getSignInAttempts, 
        deleteSignInAttempt, 
        restoreSignInAttempt, 
        destroySignInAttempt }