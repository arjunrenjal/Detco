const Footer = () => {
  return (
    <div className='flex h-[100px] w-full bg-gradient-diagonal'>
      <div className='text-white flex items-center justify-between w-full px-2'>
        <h1 className='font-bold text-lg md:text- lg:text-2xl xl:text-3xl'>
          DetCo®
        </h1>
        <div className='text-white flex space-x-4 md:space-x-6'>
          <a
            href='/contact'
            className='text-white text-sm md:text-base lg:text-lg hover:text-gray-300 hover:scale-95 focus:outline-none transition-transform duration-300'
          >
            Contact Us
          </a>
          <a
            href='/terms'
            className='text-white text-sm md:text-base lg:text-lg hover:text-gray-300 hover:scale-95 focus:outline-none transition-transform duration-300'
          >
            Terms and Conditions
          </a>
        </div>
       
      </div>
      
    </div>
    
  );
};

export default Footer;
