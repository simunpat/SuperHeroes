# SuperHeroes - Superhero Explorer

![Superhero Explorer](https://via.placeholder.com/800x400?text=Superhero+Explorer)

A modern, responsive web application that allows users to explore and search for superheroes from various comic universes. Built with Angular, this application provides a sleek interface to browse superhero information, view detailed stats, and search for specific heroes.

## Features

- **Browse Superheroes**: View a collection of superheroes with their basic information
- **Search Functionality**: Search heroes by name or ID
- **Detailed Hero Profiles**: View comprehensive information about each superhero including:
  - Power stats (intelligence, strength, speed, etc.)
  - Biographical information
  - Physical appearance details
  - Work and occupation
  - Connections and affiliations
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Clean, comic-inspired design with smooth animations

## Screenshots

### Home Page
![Home Page](https://via.placeholder.com/400x200?text=Home+Page)

### Hero Details
![Hero Details](https://via.placeholder.com/400x200?text=Hero+Details)

## How to Use

1. **Browse Heroes**: The home page displays a collection of superheroes
2. **Search**: Use the search bar to find heroes by name (e.g., "Batman") or by ID
3. **View Details**: Click on "View Details" to see comprehensive information about a hero
4. **Pagination**: Navigate through multiple pages of heroes using the pagination controls

## Technical Details

This application uses:
- **Angular**: Frontend framework (v19.2.1)
- **RxJS**: For reactive programming
- **Superhero API**: External API for superhero data
- **CSS**: Custom styling with responsive design
- **Google Fonts**: 'Bangers' for headings and 'Montserrat' for body text

## API Information

This application uses a superhero API to fetch data. The API provides information about superheroes from various comic universes including Marvel and DC.

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Future Enhancements

- Add ability to compare heroes
- Implement hero filtering by publisher, alignment, or other attributes
- Create user accounts to save favorite heroes
- Add more detailed information and comic appearances

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Superhero API for providing the data
- Angular team for the excellent framework
- All superhero fans who provided feedback
