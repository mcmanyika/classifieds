const PricingPlan = () => {
    const plans = [
      {
        title: "Premium Contact Info",
        price: "$5.99/mo",
        description: "Contact info, including all phones & addresses",
        includes: ["20 Contact Info Lookups", "Save & Export Contacts"],
        buttonText: "Select",
        additionalInfo: "Cancel anytime.",
      },
      {
        title: "Premium Business",
        price: "$9.99/mo",
        description:
          "Complete contact info, including all emails, phones & addresses PLUS time-saving tools",
        includes: [
          "20 Contact Info Lookups",
          "Email Addresses",
          "Property Value Forecasts",
          "Speed Search",
        ],
        buttonText: "Select",
        additionalInfo: "Cancel anytime.",
        mostPopular: true,
      },
      {
        title: "Premium Business Enterprise",
        price: "$199.99/mo",
        description:
          "1000 contact info lookups, including all emails, phones & addresses PLUS time-saving tools",
        includes: ["1000 Contact Info Lookups", "Maximum Contact Info Lookups"],
        buttonText: "Select",
        additionalInfo: "Cancel anytime.",
      }
    ];
  
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`p-6 border rounded-lg shadow-md bg-white ${
                  plan.mostPopular ? "border-blue-500" : "border-gray-200"
                }`}
              >
                {plan.mostPopular && (
                  <div className="text-sm font-semibold text-blue-600 mb-2">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4">{plan.title}</h3>
                <p className="text-2xl font-bold text-gray-800 mb-4">
                  {plan.price}
                </p>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <ul className="mb-6">
                  {plan.includes.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-700 mb-2">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  {plan.buttonText}
                </button>
                <p className="text-sm text-gray-500 mt-2">{plan.additionalInfo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default PricingPlan;
  