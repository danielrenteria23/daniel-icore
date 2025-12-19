Take home assignment from iCore.

## Getting Started

Simple steps to get it running. With a recent version of node installed in the root of the project, install and run the server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Summary

I spent about ~3 hours on this and would have spent more time but had a bit of time constraints. Simply, a figma file was provided and my goal was to bring this design to life and host on Vercel.

I went a bit beyond the base requirements when it came to functionality and thought of real world functionality. An example of this is that the URLs are shareable. I have been in a situation where I was looking at a table of data and wanted to share that data with a colleague of mine--but I wanted the filter and sort states retained. This being the case I implemented that here, and found that important. The trade off of doing this was that it's not exactly pixel perfect or the colors are not all configured to variables. I think it looks great, but known gaps are using one-off colors like "text-[#746574]" vs placing those in tailwind vars. Nevertheless, I still configured some colors in vars to show the knowledge of it.

Some other things I prioritized were:

- Reponsiveness (always prioritized)
- Search debouncing, though no real calls are being made here
- Disabling of fields when loading or when actions are not available

## Config and More Details

I tried to keep this super lightweight, so I essentially only added two libraries--prettier and react-icons. Prettier I use to keep the code tidy and automatically sort my tailwind classes. This is very nice when you go deep into styling and want to stay consistent. React-icons allowed me to use basically the exact icons in the Figma.

In a usual case where there is a whole design system, custom icons or assets would be exported optimally (in SVG or best format), and the used in the codebase. This was a simpler problem, so that was not needed here.

## AI Usage

I was talked with creating data and thought this was a nice and easy use case for AI. I had claude help me generate random names and dates and color mappings for producing the data of 250 rows.

When I was determining the final shape of the claims data, I also asked it to review and tidy up any parts of the state that might be missing or can be optimized.

## If I Had More Time

If I had more time, I would absolutely make this more pixel perfect with colors and variables being completely configured. I would gather actual font files, too, and ensure that is perfect. I would also tighten up accessibilty and improve upon that. This is usually a priority, but with time restraints and given the situation, I did not prioritize. I would also implement error states, but that is not a realistic case in this situation.
