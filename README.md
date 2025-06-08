# Verda: Track More, Waste Less

Submission for KTHacks 2025

**Devpost: [https://devpost.com/software/verda-edo7uq](https://devpost.com/software/verda-edo7uq)**

-----

## Features

  * **Trash Sorter:** Uses **AI to identify items** via your camera and suggests the **correct disposal bin based on regional guidelines**, eliminating recycling guesswork.
  * **CO2 Calculator:** Helps you **estimate the carbon footprint** of your daily activities.
  * **History:** Tracks your **trash scans, CO2 calculations, and AI recommendations** over time, allowing you to monitor your progress in adopting sustainable practices.
  * **AI-Powered Quiz:** Offers **personalized guidance** based on user responses, deepening understanding of sustainable practices.
  * **Ranking System:** Allows users to **track progress and see how they stack up** against others, making eco-conscious habits engaging.

-----

## Built With

  * **HTML**
  * **CSS**
  * **Next.js**
  * **Tailwind CSS**
  * **Google Gemini API**
  * **Google Teachable Machine**
  * **Supabase**

-----

## Getting Started

To run Verda locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [your_repository_url_here]
    cd verda
    ```

2.  **Install dependencies:**

    ```bash
    npm i
    npm install @supabase/supabase-js @teachablemachine/image @supabase/auth-helpers-nextjs
    npm install --save-dev @types/react @types/node
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your API keys:

    ```
    NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

      * **`YOUR_GEMINI_API_KEY`**: Obtain this from the Google AI Studio or Google Cloud Console.
      * **`YOUR_SUPABASE_URL`**: Find this in your Supabase project settings.
      * **`YOUR_SUPABASE_ANON_KEY`**: Find this in your Supabase project settings.

4.  **Start the development server:**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the application.

-----

## Inspiration

Did you know that **263.16 billion pounds** of recyclable material are mis-sorted or not recovered every year in the U.S. alone? It's a staggering amount that highlights a major hurdle in our fight against climate change. We believe that empowering individuals with the right tools can make a monumental difference. That's why we created Verda—to transform confusion into clarity and enable everyone to be a part of the solution, right from their homes.

-----

## Social Impact

Verda drives **real behavioral change** by making environmental responsibility tangible. We raise awareness by helping users visualize their **carbon footprint** and **waste habits**. By tracking CO2 and waste, and providing **country-specific suggestions** for proper disposal and reduction, Verda helps users actively contribute to a greener planet.

-----

## How We Built It

To build Verda efficiently, we leveraged publicly available datasets and machine-learning models for the AI-powered trash sorter. We meticulously researched **20 countries' trash-sorting systems** to provide individualized guidance. **Google's Gemini 1.5 Flash model** powers our AI recommendations and complex CO2 emission calculations, handling parameters that simple formulas couldn't. The ranking system was developed using a robust **Supabase backend** for accurate tracking and display.

-----

## Challenges We Ran Into

Our most significant challenge was **setting up and managing the database** to handle the vast and varied information required for waste identification and precise, country-specific sorting rules. The diverse recycling guidelines across regions demanded extensive research and careful data structuring. We also dedicated considerable effort to designing an **intuitive UI/UX** that simplifies complex waste disposal decisions.

-----

## Accomplishments We're Proud Of

We are incredibly proud of Verda's **smooth styling and intuitive user interface**, which creates a seamless user experience. Getting the **backend to work efficiently and reliably** was a major accomplishment, ensuring our AI and data processing run smoothly. We are also thrilled with the **engaging and educational experience** provided by our AI-powered quizzes, which foster a deeper understanding of sustainable living.

-----

## What We Learned

Building Verda was a profound learning experience. We gained significant expertise in **backend development**, complex data structures, and seamless communication between components. We honed our skills in **version control** and deep-dived into **frontend styling** and **user-centered design**. We also mastered the intricacies of **deployment on domains**. Beyond technical skills, we learned extensively about global **waste statistics** and the diverse **waste sorting systems** in different countries.

-----

## What's Next for Verda

For Verda, we envision **integrating with hardware**, specifically smart bins already being deployed in some regions, for a more automated experience. Our next major goal is to **expand our database to include all countries worldwide**, solidifying Verda as a truly global solution for waste sorting. We're excited to continue empowering individuals to make a tangible difference in waste management and sustainability.


