const Contact = () => {
    return (
      <section id="contact" className="section py-20 fade-in-section">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 gradient-text">Get In Touch</h2>
  
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p>
                Interested in collaboration? Let's connect and discuss how we can work together.
              </p>
  
              <div className="flex space-x-4">
                <a 
                  href="https://linkedin.com/in/yourusername" 
                  className="text-gray-300 hover:text-white"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/yourusername" 
                  className="text-gray-300 hover:text-white"
                >
                  GitHub
                </a>
                <a 
                  href="mailto:your.email@example.com" 
                  className="text-gray-300 hover:text-white"
                >
                  Email
                </a>
              </div>
            </div>
  
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="w-full p-2 bg-gray-800 rounded"
                  required 
                />
              </div>
  
              <div>
                <label htmlFor="email" className="block mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="w-full p-2 bg-gray-800 rounded"
                  required 
                />
              </div>
  
              <div>
                <label htmlFor="message" className="block mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5}
                  className="w-full p-2 bg-gray-800 rounded"
                  required 
                ></textarea>
              </div>
  
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  };
  
  export default Contact;