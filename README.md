# Personal Portfolio Website 🚀

Welcome to my portfolio repository! This website showcases my projects, skills, and professional journey. Built with modern web technologies, it features a responsive design and interactive elements to provide visitors with an engaging experience.

## 🌟 Features

- **Project Showcase**: Interactive cards displaying my key projects with detailed modal views
- **Responsive Design**: Seamless experience across all devices and screen sizes
- **Dark Mode**: Eye-friendly dark theme with modern glassmorphism effects
- **PDF Viewer**: Integrated viewer for research papers and documentation
- **Performance Optimized**: Fast loading times and smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Animations**: Custom CSS animations and transitions
- **PDF Handling**: React PDF viewer
- **Deployment**: Vercel

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Arsive02/sivakumar_portfolio.git
```

2. Install dependencies:
```bash
cd sivakumar_portfolio
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectModal.tsx
│   │   └── shared/
│   │       └── PDFViewer.tsx
│   ├── styles/
│   │   └── globals.css
│   └── pages/
│       └── index.tsx
├── public/
│   └── assets/
└── package.json
```

## 🎨 Customization

### Adding New Projects

1. Add your project data to the projects array in `src/data/projects.ts`:
```typescript
export const projects = [
  {
    title: "Project Name",
    description: "Short description",
    longDescription: "Detailed description",
    tags: ["React", "TypeScript", "Tailwind"],
    githubUrl: "https://github.com/...",
    demoUrl: "https://...",
    image: "/path/to/image.jpg",
    // ... other properties
  },
  // ... more projects
];
```

### Modifying Styles

- Global styles are managed in `src/styles/globals.css`
- Component-specific styles use Tailwind CSS classes
- Theme customization is available in `tailwind.config.js`

## 💡 Future Enhancements

- [ ] Integrate CI/CD pipeline
- [ ] Live demos

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

While this is primarily a personal portfolio, suggestions and feedback are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

Sivakumar - sivakumar2ramakrishnan@gmail.com

Project Link: ![https://sivakumar-portfolio-omega.vercel.app/](https://sivakumar-portfolio-omega.vercel.app/)

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- All the amazing developers who maintain the libraries used in this project

---

<p align="center">Made by Sivakumar and Claude :) </p>
