# ADU Planner
Project @ 2024 LlamaIndex RAG Hackathon

Revolutionize the ADU construction process with our GAI-powered ADU planner, a brand new solution to provide effortless design, local compliance, and quick supplier connections in one click.

## Inspiration
A lot of people in the US have the need to attach an accessory dwelling unit (ADU) in their backyard.  The Accessory Dwelling Units (ADUs) market in the United States is estimated to be around $127.1 billion. The current process to find and plan for installation of an ADU is very time-consuming. We propose a brand new solution - GAI-powered ADU planner, to provide a personalized and user-friendly solution for generating an ADU plan for users, a solution to revolutionize the current ADU construction and to 5X speed up the process.

## What it does
With our GAI-powered ADU planner, a user can get an ADU plan based on their property layout and their state’s ADU building policy by simply inputting their property address on our website. From the property address input, our website provides nearby ADU suppliers and floorplan options that align with the construction requirements. Users will be able to get a visual rendering according to their option.

## How we built it
1. User inputs address,
    - Pick options, e.g.: budget, layout (1b1b/studio), etc.
    - (Use budget to inform sizing.)
2. Retrieve data from Google Maps
    - Satellite imaging
    - Dwelling location
    - Lot size
3. Interpret building codes to identify buildable regions on lot
    - Min. distance from the main dwelling, fire safety, utilities, etc.
4. Agent process:
    - Collect sample layouts from local builders,
    - Retrieve local building codes,
    - Interpret local building codes (as design rules),
    - Estimate price per square foot for construction
    - Iteratively generate and test designs
5. Output top results from the agent process,
    - 2D Render / Plotting
    - 3D Render
7. App outputs potential placements for ADUs on their lot
