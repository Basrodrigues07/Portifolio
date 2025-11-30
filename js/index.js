const texts = [
    'Apaixonado por tecnologia 💻',
    'Criando soluções inovadoras 🚀',
    'Sempre aprendendo algo novo 📚',
    'Transformando ideias em código ⚡'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = texts[textIndex];
    const typingElement = document.getElementById('typing-text');
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    setTimeout(typeWriter, isDeleting ? 50 : 100);
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

function animateSkill(skillItem) {
    const progress = skillItem.querySelector('.skill-progress');
    const skill = progress.getAttribute('data-skill');
    progress.style.width = '0';
    setTimeout(() => {
        progress.style.width = skill + '%';
    }, 100);
}

const aboutTexts = {
    about: 'Sou estudante de Tecnologia da Informação e busco um estágio na área para aplicar meus conhecimentos em desenvolvimento de sistemas e suporte técnico, enquanto aprendo novas habilidades. Tenho motivação, facilidade para trabalhar em equipe e desejo de contribuir com soluções que tragam valor à empresa.',
    objectives: 'Procuro fazer parte de uma equipe onde possa contribuir com minhas habilidades técnicas e ao mesmo tempo continuar crescendo profissionalmente. Valorizo ambientes colaborativos onde a troca de conhecimento é incentivada e a inovação é parte da cultura. Tenho interesse especial em empresas que investem em tecnologias modernas, metodologias ágeis e que valorizam o desenvolvimento contínuo de seus profissionais.',
    skills: 'Tenho conhecimentos em HTML, CSS, PHP e SQL. Estou aprendendo frameworks como JavaScript, C# e React para desenvolvimento web. Também tenho noções de redes, segurança da informação e suporte técnico. Sou dedicado a aprimorar minhas habilidades técnicas e interpessoais para contribuir efetivamente em uma equipe de TI.'
};

function createProgressiveTypeWriter(text, selector, callback) {
    const element = document.querySelector(selector);
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 25);
        } else {
            if (callback) setTimeout(callback, 300);
        }
    }
    type();
}

function setupHoverExpansion(selector, fullText) {
    const element = document.querySelector(selector);
    
    element.addEventListener('mouseenter', function() {
        this.textContent = fullText;
    });
}

function startTypingSequence() {
    createProgressiveTypeWriter(aboutTexts.about, '.typing-text', () => {
        setupHoverExpansion('.typing-text', aboutTexts.about);
        
        createProgressiveTypeWriter(aboutTexts.objectives, '.typing-text-objectives', () => {
            setupHoverExpansion('.typing-text-objectives', aboutTexts.objectives);
            
            createProgressiveTypeWriter(aboutTexts.skills, '.typing-text-skills', () => {
                setupHoverExpansion('.typing-text-skills', aboutTexts.skills);
                
                setTimeout(() => {
                    document.querySelector('.skills-grid').style.display = 'grid';
                    document.querySelectorAll('.skill-item').forEach(animateSkill);
                }, 100);
            });
        });
    });
}

function filterProjects(category) {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        const projectCategory = project.dataset.category;
        if (category === 'all' || projectCategory === category) {
            project.classList.remove('hidden');
        } else {
            project.classList.add('hidden');
        }
    });
    updateCounts();
}

function searchProjects(query) {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        const title = project.querySelector('h2').textContent.toLowerCase();
        const description = project.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(project.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        if (title.includes(query) || description.includes(query) || tags.includes(query)) {
            project.classList.remove('hidden');
        } else {
            project.classList.add('hidden');
        }
    });
}

function updateCounts() {
    const projects = document.querySelectorAll('.project');
    const categories = ['all', 'web', 'desktop', 'database'];
    categories.forEach(cat => {
        let count = 0;
        if (cat === 'all') {
            count = projects.length;
        } else {
            count = Array.from(projects).filter(p => p.dataset.category === cat).length;
        }
        const countElement = document.getElementById(`count-${cat}`);
        if (countElement) countElement.textContent = count;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    typeWriter();
    
    setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            startTypingSequence();
            
            document.querySelectorAll('.section-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    }, 2000);
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    
    if (filterBtns.length > 0) {
        updateCounts();
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterProjects(this.dataset.filter);
            });
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query) {
                searchProjects(query);
            } else {
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) filterProjects(activeBtn.dataset.filter);
            }
        });
    }
});