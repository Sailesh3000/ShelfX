import HeroImg from "../assets/heroimg.png"

const Hero = () => {
  return (
    <div className="p-0">
      <h1 className="big-shoulders-inline-text-h1 text-8xl text-[#EEEEEE] tracking-widest xl:p-4  xl:py-12 xl:mt-6 xl:max-w-2xl lg:max-w-full text-center xl:pl-24  md:mt-16 sm:text-center sm:mt-16">
        Shelf X
      </h1>
      <div className="sm:text-center xl:flex xl:flex-row xl:justify-between lg:flex lg:flex-col lg:gap-32 lg:">
        <div className="p-4 xl:p-6 xl:pl-32 xl:py-12 xl:mt-8 text-[#EEEEEE] text-2xl xl:max-w-2xl md:px-16 md:max-w-full md:text-center md:mt-16 xl:text-center leading-10 sm:px-16 sm:text-center sm:mt-16">
          <span className="text-[#FFD369] text-3xl"><span className="text-8xl">D</span>iscover </span>
 a world of stories at your fingertips. Whether you're looking to rent, buy, or sell books, ShelfX connects you with book lovers who share your passion. Join our community, explore endless titles, and find your next great read today!
          <br></br>
          <br></br>
          <div>
            <div className="lg:px-28 flex flex-row md:px-48 sm:flex sm:flex-row justify-center">
              <dotlottie-player src="https://lottie.host/4568a68e-712e-46e9-9438-c0ad81ea8533/7C5WvzpoSV.json" background="transparent" speed="1" style={{width: 100 ,height: 100}} loop autoplay></dotlottie-player>
              <button
                type="button"
                className="text-[#222831] font-medium rounded-lg w-[150px] h-[60px] text-base px-4 py-2 p-4 text-center bg-[#FFD369] hover:bg-[#ecd5a0] focus:bg-[#ecc363] "
              >
                Upload a Book
              </button>
            </div>
          </div>
        </div>
        <div className="hidden h-full sm:block lg:mt-[-190px] lg:mr-[100px] xl:border-b-8 xl:border-b-[#FFD369] md:border-b-8 md:border-b-[#FFD369] sm:border-b-[#FFD369] sm:border-b-8"> {/* Hide on small screens and adjust margin for larger screens */}
          <img src={HeroImg} alt="vote img" className=""/>
        </div>
      </div>
    </div>
  )
}

export default Hero
