import { useReducer, useEffect } from "react";
import testimonialsData from "../../../../data/testimoni/testimonials.json";
import { 
  processCompanyData, 
  generateAnalytics, 
  generateCompanyTimeline, 
  generateTeamMembers, 
  generatePortfolio, 
  findRelatedCompanies,
  createCompanySlug
} from "../utils/companyUtils";

// State Management Reducer
const companyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_DATA':
      return { 
        ...state, 
        companyData: action.payload.data,
        filteredAndSortedTestimonials: action.payload.data.testimonials,
        isLoading: false,
        error: null
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload,
        isLoading: false 
      };
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload }
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_FILTERED_TESTIMONIALS':
      return { ...state, filteredAndSortedTestimonials: action.payload };
    case 'TRACK_VIEW':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          pageViews: state.analytics.pageViews + 1,
          lastViewed: new Date().toISOString()
        }
      };
    default:
      return state;
  }
};

const initialState = {
  isLoading: true,
  companyData: null,
  filteredAndSortedTestimonials: [],
  error: null,
  filters: {
    rating: null,
    budget: null,
    duration: null,
    technologies: [],
    projectType: null
  },
  searchQuery: '',
  sortBy: 'rating',
  activeTab: 'overview',
  analytics: {
    pageViews: 0,
    lastViewed: null,
    interactions: 0
  }
};

export const useCompanyData = (slug) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const companyTestimonials = testimonialsData.filter(t => 
          createCompanySlug(t.company) === slug
        );

        if (companyTestimonials.length === 0) {
          dispatch({ type: 'SET_ERROR', payload: 'Company not found' });
          return;
        }

        const companyInfo = processCompanyData(companyTestimonials);
        dispatch({ 
          type: 'SET_DATA', 
          payload: { 
            data: {
              info: companyInfo,
              testimonials: companyTestimonials,
              analytics: generateAnalytics(companyTestimonials),
              timeline: generateCompanyTimeline(companyTestimonials),
              team: generateTeamMembers(companyTestimonials),
              portfolio: generatePortfolio(companyTestimonials),
              relatedCompanies: findRelatedCompanies(companyTestimonials[0].company)
            }
          } 
        });

        // Track page view
        dispatch({ type: 'TRACK_VIEW' });

      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    if (slug) {
      loadCompanyData();
    }
  }, [slug]);

  return { state, dispatch };
};