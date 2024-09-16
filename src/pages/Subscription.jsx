import React from 'react'

const Subscription = () => {
  return (
    <section className="bg-[#222831]">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#EEEEEE]">Flexible Plans for Book Lovers</h2>
          <p className="mb-5 font-light text-[#EEEEEE] sm:text-xl">
            Start with 5 free book uploads, and grow your library with our affordable subscription plans.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          
          {/* Free Plan */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-[#EEEEEE] bg-[#393E46] rounded-lg border border-[#393E46] shadow xl:p-8">
            <h3 className="mb-4 text-2xl font-semibold">Free Tier</h3>
            <p className="font-light sm:text-lg text-[#EEEEEE]">Perfect for new users to upload up to 5 books for free.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">Free</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Upload up to 5 books</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>No setup or hidden fees</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Basic support</span>
              </li>
            </ul>
            <a href="#" className="text-[#222831] bg-[#FFD369] hover:bg-yellow-400 focus:ring-4 focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get started</a>
          </div>

          {/* Starter Plan */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-[#EEEEEE] bg-[#393E46] rounded-lg border border-[#393E46] shadow xl:p-8">
            <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
            <p className="font-light sm:text-lg text-[#EEEEEE]">For users who need to upload more than 5 books.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">₹2,400</span>
              <span className="text-[#EEEEEE]">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Upload up to 50 books</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>No setup or hidden fees</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Basic support</span>
              </li>
            </ul>
            <a href="#" className="text-[#222831] bg-[#FFD369] hover:bg-yellow-400 focus:ring-4 focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get started</a>
          </div>

          {/* Premium Plan */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-[#EEEEEE] bg-[#393E46] rounded-lg border border-[#393E46] shadow xl:p-8">
            <h3 className="mb-4 text-2xl font-semibold">Premium</h3>
            <p className="font-light sm:text-lg text-[#EEEEEE]">For organizations or individuals with large book collections.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">₹8,200</span>
              <span className="text-[#EEEEEE]">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Unlimited book uploads</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-[#FFD369]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Access to premium features</span>
              </li>
            </ul>
            <a href="#" className="text-[#222831] bg-[#FFD369] hover:bg-yellow-400 focus:ring-4 focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get started</a>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Subscription
