import React, { useState } from 'react';
import './App.css';

const App = () => {
  // Data
  const categories = [
    {
      name: "Growth & Marketing",
      subFunctions: [
        { id: 1, name: "Audience Segmentation & Predictive Targeting", weight: 5 },
        { id: 2, name: "Automated Media Buying & Dynamic Bidding", weight: 5 },
        { id: 3, name: "Programmatic Ad Copy & Content Generation", weight: 5 }
      ]
    },
    {
      name: "eCommerce Operations & Storefront",
      subFunctions: [
        { id: 4, name: "Real-Time Personalization & Merchandising", weight: 5 },
        { id: 5, name: "AI-Powered Search Optimization", weight: 5 },
        { id: 6, name: "Automated UX Testing & Performance Analytics", weight: 5 }
      ]
    },
    {
      name: "Customer Support & Experience",
      subFunctions: [
        { id: 7, name: "AI Chatbots & Event-Triggered Support", weight: 5 },
        { id: 8, name: "Sentiment-Based Ticket Prioritization", weight: 5 }
      ]
    },
    {
      name: "Supply Chain & Fulfillment",
      subFunctions: [
        { id: 9, name: "Demand Forecasting & Anomaly Detection", weight: 5 },
        { id: 10, name: "Predictive Logistics & Route Optimization", weight: 5 }
      ]
    },
    {
      name: "Data & Business Intelligence",
      subFunctions: [
        { id: 11, name: "Customer Clustering & Strategic Segmentation", weight: 5 },
        { id: 12, name: "Unified Business Insights & Analytics", weight: 5 }
      ]
    },
    {
      name: "Finance & Revenue Optimization",
      subFunctions: [
        { id: 13, name: "AI-Based Dynamic Pricing & Revenue Modeling", weight: 5 },
        { id: 14, name: "Fraud Detection & Transaction Risk Scoring", weight: 5 }
      ]
    },
    {
      name: "HR & Workforce AI",
      subFunctions: [
        { id: 15, name: "AI-Driven Candidate Screening & Talent Matching", weight: 2.5 },
        { id: 16, name: "AI for Employee Retention & Training", weight: 2.5 }
      ]
    },
    {
      name: "Legal & Compliance",
      subFunctions: [
        { id: 17, name: "AI-Powered Contract Analysis & Risk Scoring", weight: 2.5 },
        { id: 18, name: "AI for Compliance & Regulatory Adherence", weight: 2.5 }
      ]
    },
    {
      name: "International Expansion & Localization",
      subFunctions: [
        { id: 19, name: "AI for Cross-Border Pricing & Tax Compliance", weight: 2.5 },
        { id: 20, name: "NLP-Powered Product Localization", weight: 2.5 }
      ]
    },
    {
      name: "Sustainability & ESG",
      subFunctions: [
        { id: 21, name: "Carbon Footprint Tracking via AI", weight: 2.5 },
        { id: 22, name: "AI for Ethical Supply Chain Monitoring", weight: 2.5 }
      ]
    },
  ];

  const scoreOptions = [
    { value: 0, label: "Not Implemented" },
    { value: 1, label: "Basic Awareness" },
    { value: 2, label: "Initial Adoption" },
    { value: 3, label: "Moderate Implementation" },
    { value: 4, label: "Advanced Implementation" },
    { value: 5, label: "AI-Driven Excellence" }
  ];

  // Flatten all questions into a single array
  const allQuestions = categories.flatMap(category =>
    category.subFunctions.map(subFunction => ({
      ...subFunction,
      categoryName: category.name
    }))
  );

  // State
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scores, setScores] = useState({
    total: 0,
    categoryScores: []
  });

  // Calculate progress
  const totalQuestions = allQuestions.length;
  const completedQuestions = Object.keys(selections).length;
  const progress = Math.round((completedQuestions / totalQuestions) * 100);

  // Get current question
  const currentQuestion = allQuestions[currentQuestionIndex];

  // Find current category
  const getCurrentCategoryInfo = () => {
    const currentCategoryName = currentQuestion.categoryName;
    const category = categories.find(cat => cat.name === currentCategoryName);

    // Get all questions for this category
    const categoryQuestions = allQuestions.filter(q => q.categoryName === currentCategoryName);
    const categoryQuestionIds = categoryQuestions.map(q => q.id);

    // Calculate how many questions in this category have been answered
    const answeredInCategory = Object.keys(selections)
      .filter(id => categoryQuestionIds.includes(parseInt(id)))
      .length;

    return {
      category,
      totalInCategory: categoryQuestions.length,
      answeredInCategory,
      progress: (answeredInCategory / categoryQuestions.length) * 100
    };
  };

  const categoryInfo = currentQuestion ? getCurrentCategoryInfo() : null;

  // Calculate final scores
  const calculateScores = () => {
    const totalWeight = categories.reduce((acc, category) => {
      return acc + category.subFunctions.reduce((sum, sf) => sum + sf.weight, 0);
    }, 0);

    const categoryScores = categories.map(category => {
      const subFunctionScores = category.subFunctions.map(sf => {
        const score = selections[sf.id] || 0;
        return {
          name: sf.name,
          score: score,
          weightedScore: (score / 5) * sf.weight,
          weight: sf.weight
        };
      });

      const categoryWeightedScore = subFunctionScores.reduce((sum, sf) => sum + sf.weightedScore, 0);
      const categoryWeight = subFunctionScores.reduce((sum, sf) => sum + sf.weight, 0);
      const categoryPercentage = (categoryWeightedScore / categoryWeight) * 100;

      return {
        name: category.name,
        subFunctions: subFunctionScores,
        score: categoryWeightedScore,
        weight: categoryWeight,
        percentage: categoryPercentage.toFixed(1)
      };
    });

    const totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
    const maxPossibleScore = totalWeight;
    const overallPercentage = (totalScore / maxPossibleScore) * 100;

    return {
      total: overallPercentage.toFixed(1),
      categoryScores
    };
  };

  // Handle starting the assessment
  const handleStartAssessment = () => {
    setShowWelcomeScreen(false);
  };

  // Handle option selection
  const handleOptionSelect = (subFunctionId, value) => {
    setSelections({
      ...selections,
      [subFunctionId]: value
    });

    // Clear error when user makes a selection
    if (showError) {
      setShowError(false);
      setErrorMessage("");
    }

    // Automatically move to next question after selection
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300); // Small delay for better UX
    }
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);

      // Clear any error messages when navigating
      setShowError(false);
      setErrorMessage("");
    }
  };

  const handleNext = () => {
    // Check if current question is answered
    if (selections[currentQuestion.id] === undefined) {
      setShowError(true);
      setErrorMessage("Please answer this question before proceeding.");
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowError(false);
      setErrorMessage("");
    } else {
      // On last question, check if all questions are answered
      if (completedQuestions === totalQuestions) {
        // Calculate final scores and show popup
        const finalScores = calculateScores();
        setScores(finalScores);
        setShowPopup(true);
        setShowError(false);
      } else {
        setShowError(true);
        setErrorMessage("Please answer all questions before finalizing the assessment.");
      }
    }
  };

  // Handle complete assessment
  const handleComplete = () => {
    if (selections[currentQuestion.id] === undefined) {
      setShowError(true);
      setErrorMessage("Please answer this question before completing the assessment.");
      return;
    }

    if (completedQuestions === totalQuestions) {
      // Calculate final scores and show popup
      const finalScores = calculateScores();
      setScores(finalScores);
      setShowPopup(true);
      setShowError(false);
    } else {
      setShowError(true);
      setErrorMessage(`Please answer all questions before finalizing. You have completed ${completedQuestions} out of ${totalQuestions} questions.`);
    }
  };

  // Handle close popup and reset
  const handleClosePopup = () => {
    setShowPopup(false);
    // Reset selections
    setSelections({});
    // Reset to first question
    setCurrentQuestionIndex(0);
    // Clear any errors
    setShowError(false);
    setErrorMessage("");
    // Show welcome screen again
    setShowWelcomeScreen(true);
  };

  const getCurrentScoreLevel = (score) => {
    const scoreNum = parseFloat(score);
    if (scoreNum >= 80) return "Advanced";
    if (scoreNum >= 60) return "Proficient";
    if (scoreNum >= 40) return "Developing";
    if (scoreNum >= 20) return "Basic";
    return "Beginner";
  };

  // Render welcome screen
  if (showWelcomeScreen) {
    return (
      <div className="container">
        <div className="welcome-screen">
          <h1 className="welcome-title">AI READINESS<br />ASSESSMENT</h1>
          <p className="welcome-description">
            Welcome to the AI Readiness Assessment!<br/>
            This tool will guide you through key areas of<br/>
            your business to evaluate your AI readiness.
          </p>
          <button className="start-button" onClick={handleStartAssessment}>
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="title">AI Readiness Assessment</h1>
        <div>
          <div className="progress-text">
            <span>{completedQuestions}</span>/<span>{totalQuestions}</span> questions completed
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {showError && (
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">!</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Category Title and Progress */}
      <div className="category-title-container">
        <h2 className="category-title">{currentQuestion.categoryName}</h2>
        <div className="category-progress">
          <div className="category-progress-label">
            Category progress: {categoryInfo.answeredInCategory}/{categoryInfo.totalInCategory}
          </div>
          <div className="category-progress-bar-container">
            <div
              className="category-progress-bar"
              style={{ width: `${categoryInfo.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Current Question */}
      <div
        className={`question-card ${selections[currentQuestion.id] === undefined && showError ? 'card-error' : ''}`}
      >
        <div className="card-header">
          <div className="card-number">{currentQuestionIndex + 1}</div>
          <div className="card-weight">Weight: {currentQuestion.weight}%</div>
        </div>
        <h3 className="card-title">{currentQuestion.name}</h3>
        <div className="options-container">
          {scoreOptions.map(option => (
            <div
              key={option.value}
              className={`option ${selections[currentQuestion.id] === option.value ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
        {selections[currentQuestion.id] === undefined && showError && (
          <div className="required-indicator">Required</div>
        )}
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button
          className={`btn ${currentQuestionIndex === 0 ? 'btn-disabled' : 'btn-primary'}`}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleComplete}
          >
            Complete Assessment
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>

      {/* Results Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h2>AI Readiness Assessment Results</h2>
              <button className="close-button" onClick={handleClosePopup}>×</button>
            </div>
            <div className="popup-content">
              <div className="overall-score">
                <h3>Overall AI Readiness Score</h3>
                <div className="score-circle">
                  <span className="score-value">{scores.total}%</span>
                </div>
                <p className="score-level">{getCurrentScoreLevel(scores.total)} Level</p>
              </div>

              <div className="category-scores">
                <h3>Category Breakdown</h3>
                <div className="category-scores-container">
                  {scores.categoryScores.map((category, index) => (
                    <div className="category-score-item" key={index}>
                      <div className="category-score-header">
                        <h4>{category.name}</h4>
                        <span className="category-percentage">{category.percentage}%</span>
                      </div>
                      <div className="category-score-bar-container">
                        <div
                          className="category-score-bar"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="popup-actions">
                <button className="btn btn-primary full-width" onClick={handleClosePopup}>
                  Start New Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;