PEOPLE = {
    'daniel': 'Daniel Chen', 'katherine': 'Katherine Fei', 'jack': 'Jack Li', 'eliot': 'Eliot Bih', 'robert': 'Robert Liu Meng',
    'sue': 'Sue Nian', 'vincent': 'Vincent Yang', 'sam': 'Sam Moon', 'isaac': 'Isaac Tsui', 'austin': 'Austin Ma',
    'victor': 'Victor Pan', 'gary': 'Gary Han', 'albert': 'Albert Zhang', 'andrew': 'Andrew Liu',
    'leon': 'Leon Zhang', 'mike': 'Mike Lu',
}
def initials(n): return ''.join(w[0] for w in n.split()[:2])
def first(pid): return PEOPLE[pid].split()[0]

SUBJECTS = [
    ('math', 'Mathematics', 'Math', 'From times tables to derivatives, with the problem-solving habits that make the next unit easier.',
     'Number sense and arithmetic for younger students, algebra and geometry in middle school, and precalculus, calculus and contest problems for high schoolers.',
     ['Algebra through calculus', 'SAT and ACT math', 'AMC competition math', 'Problem-solving strategies', 'Math games for younger students'], ['jack', 'sam', 'eliot']),
    ('english', 'English and Writing', 'English', 'Reading closely and writing clearly, from a first book report to a college essay.',
     'Reading for meaning, building an argument, and the grammar and vocabulary underneath both, through to speaking with confidence in front of a room.',
     ['Essay writing and structure', 'Reading comprehension', 'Grammar and vocabulary', 'Creative writing', 'Public speaking'], ['robert', 'daniel']),
    ('science', 'Science', 'Science', 'Biology, chemistry and physics, with the lab work and the writing that go with them.',
     'The ideas behind each unit, the experiments that test them, and the reports that explain them, from a first science fair to high school lab courses.',
     ['Biology and chemistry', 'Physics fundamentals', 'Lab report writing', 'Science fair projects', 'How it applies outside class'], ['eliot', 'gary', 'sue']),
    ('coding', 'Coding', 'Coding', 'How to think like a computer scientist, by building apps, games and small tools.',
     'Writing first programs, then structuring larger ones, then solving the algorithm problems used in programming contests.',
     ['Python, Java and C++', 'HTML, CSS and JavaScript', 'Algorithmic thinking', 'USACO and competitive programming', 'Creative coding and AI basics'], ['jack', 'victor']),
    ('music', 'Music', 'Music', 'Lessons and theory from officers who have played for years, from first notes to a recital.',
     'Technique on the instrument, reading and writing music, and preparing a piece to the point where it can be performed.',
     ['Piano and keyboard', 'Violin, viola and flute', 'Guitar, acoustic and electric', 'Music theory and composition', 'Performance preparation'], ['sue', 'vincent', 'daniel', 'katherine', 'gary', 'sam']),
    ('social-studies', 'Social Studies', 'History', 'History, geography and civics: the stories behind how the world got this way.',
     'Events and the reasons behind them, how places and cultures shape each other, how government works, and how to research and present any of it.',
     ['US and world history', 'Geography and cultures', 'Government and civics', 'Research and presentations', 'Current events'], ['isaac', 'robert']),
    ('beyond', 'Beyond the Classroom', 'Beyond', 'Skills that help in every class, and a few that go past school altogether.',
     'Planning a week of homework, making art, thinking several moves ahead at the chessboard, and getting ready for the college years.',
     ['Study skills and organization', 'Digital art and design', 'Chess', 'College prep and planning', 'Confidence and life skills'], ['sue', 'sam', 'katherine']),
]
OPTIONS = ''.join(f'<option value="{s[0]}">{s[1]}</option>' for s in SUBJECTS)

OFFICERS = [
    ('leon', 'Co-President', 'Leon Zhang is a co-president of Eternal Growth.'),
    ('victor', 'Co-President', 'Victor Pan is a junior at Syosset High School with a passion for swimming and technology. He is an AI enthusiast who designs and codes AI applications, combining creativity with technical skill to explore the future of intelligent software.'),
    ('katherine', 'Vice President', 'Hi! My name is Katherine and I’m a senior from Syosset. I am very passionate about flute, art and business. Eternal Growth has been a long-term commitment for me and I’ve grown a lot throughout my years in it.'),
    ('jack', 'Webmaster', 'Jack Li is a programmer and tutor from Jericho, NY. As an AIME qualifier and USACO Gold division competitor, Jack enjoys passing on his knowledge of math and programming to young students and developing their love of STEM. He maintains the website and helps bring technology into our learning programs.'),
    ('eliot', 'Director of STEM', 'Hi! My name is Eliot and I’m a senior from Syosset. I’m very passionate about math, science and music!'),
    ('robert', 'Director of Humanities', 'Hi! I’m Robert. I joined Eternal Growth to give back to the same community that built my strengths. I chose humanities to show the people around me the beauty of finding observations qualitatively, not just quantitatively. I have taken AP Lang, am taking AP Lit, and am exploring philosophy, ideology and beyond.'),
    ('sue', 'Director of Fine Arts', 'I’ve been playing piano for 13 years and creating art for 6, and both have become essential parts of who I am. I was invited to perform at the annual NYSSMA Piano Festival. I’m also deeply interested in biology and math, and I love exploring how creativity and logic connect in both fields.'),
    ('vincent', 'Director of Sports', 'As Director of Sports, I encourage students to work and play cooperatively and competitively to keep them active. I have been a classically trained pianist for over ten years and founded Golden Sound, a music group that performs at local senior homes. I tutor younger children, coaching them through skills and confidence.'),
    ('sam', 'Secretary of Membership', 'Good morning, afternoon and evening! I’m Samuel Moon, a senior at Syosset High School, in charge of the logistics and personnel of our students, so please come to me with any questions. I teach anything from AMC tests, middle and high school math and the SAT to guitar and chess.'),
    ('isaac', 'Secretary of Outreach', 'Hi! My name is Isaac Tsui and I am the secretary of outreach. I am a junior at Syosset High School, and the things that interest me include history, aviation and literature.'),
    ('austin', 'Treasurer', 'As Treasurer of Eternal Growth, I guide the selection of organizations that receive our donations, evaluating each to make sure our funds go to causes that have a direct and meaningful impact on our community.'),
    ('mike', 'Treasurer', 'Mike Lu is a treasurer of Eternal Growth.'),
]
FOUNDERS = [
    ('daniel', 'Founder', 'Daniel is a violinist and varsity diver from Syosset. As a shortlisted writer for the John Locke Global Essay Competition, a classical violin student at the Manhattan School of Music Precollege Program, and a county-level diver, Daniel is passionate about academics, arts and sports.'),
    ('gary', 'Founder', 'Gary Han is a researcher, violist and community leader from Syosset, NY. A 2025 Regeneron ISEF Grand Award winner and YoungArts National Winner in Classical Music, he has discovered new exocomets with deep learning, performed as principal violist at Juilliard Pre-College, and founded nonprofits bringing STEM and music education to underserved students.'),
    ('albert', 'Founder', 'Albert is studying Business Administration at the Tepper School of Business at Carnegie Mellon University, class of 2029. At Syosset High School he was an active member of the DECA club.'),
    ('andrew', 'Founder', 'Andrew is a freshman at RPI studying aerospace engineering, and likes anything to do with flying or driving. At Syosset High School he helped create Eternal Growth and tutored math, reading and an introduction to computer-aided design. He hopes to work on helicopters or supersonic commercial travel.'),
]

