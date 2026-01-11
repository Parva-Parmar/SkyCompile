import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              Collaborative porject builder
            </h1>
            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
              A website where you can create and manage collaborative projects
              with ease.
            </p>
          </div>

          <div className="flex flex-wrap -m-4">
            {[
              { title: "Shooting Stars" },
              { title: "The Catalyzer" },
              { title: "Neptune" },
              { title: "Melanchole" },
              { title: "Bunker" },
              { title: "Ramona Falls" },
            ].map((item, idx) => (
              <div key={idx} className="xl:w-1/3 md:w-1/2 p-4">
                <div className="border border-gray-200 p-6 rounded-lg">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                    {item.title}
                  </h2>
                  <p className="leading-relaxed text-base">
                    Fingerstache flexitarian street art 8-bit waist co, subway
                    tile poke farm.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            <Link to="/signin">Lets build something together</Link>
          </button>
        </div>
      </section>
    </>
  );
}
