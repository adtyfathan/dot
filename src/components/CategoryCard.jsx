import React from 'react';

const CategoryCard = ({ category, image, onStartQuiz, isDisabled }) => {
    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            data-testid={`category-card-${category.id}`}
        >
            <div className="h-40 w-full overflow-hidden">
                <img
                    src={image}
                    alt={category.name}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                <button
                    onClick={() => !isDisabled && onStartQuiz(category)}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-transform ${
                        isDisabled
                            ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100'
                            : 'hover:scale-105 active:scale-95'
                    }`}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                    data-testid={`start-quiz-button-${category.id}`}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default CategoryCard;
