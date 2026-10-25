PEOPLE = {
    'leon': 'Leon Zhang', 'victor': 'Victor Pan', 'lucille': 'Lucille Lin', 'mike': 'Mike Lu', 'alan': 'Alan Chen', 'kehan': 'Kehan Ying',
    'gary': 'Gary Han', 'albert': 'Albert Zhang', 'andrew': 'Andrew Liu',
    # alumni
    'katherine': 'Katherine Fei', 'jack': 'Jack Li', 'eliot': 'Eliot Bih', 'robert': 'Robert Liu Meng', 'sue': 'Sue Nian',
    'vincent': 'Vincent Yang', 'sam': 'Sam Moon', 'isaac': 'Isaac Tsui', 'austin': 'Austin Ma',
}
def initials(n): return ''.join(w[0] for w in n.split()[:2])
def first(pid): return PEOPLE[pid].split()[0]

SUBJECTS = [
    ('math', 'Mathematics', 'Math', 'From times tables to derivatives, with the problem-solving habits that make the next unit easier.',
     'Number sense and arithmetic for younger students, algebra and geometry in middle school, and precalculus, calculus and contest problems for high schoolers.',
     ['Algebra through calculus', 'SAT and ACT math', 'AMC competition math', 'Problem-solving strategies', 'Math games for younger students'], []),
    ('english', 'English and Writing', 'English', 'Reading closely and writing clearly, from a first book report to a college essay.',
     'Reading for meaning, building an argument, and the grammar and vocabulary underneath both, through to speaking with confidence in front of a room.',
     ['Essay writing and structure', 'Reading comprehension', 'Grammar and vocabulary', 'Creative writing', 'Public speaking'], []),
    ('science', 'Science', 'Science', 'Biology, chemistry and physics, with the lab work and the writing that go with them.',
     'The ideas behind each unit, the experiments that test them, and the reports that explain them, from a first science fair to high school lab courses.',
     ['Biology and chemistry', 'Physics fundamentals', 'Lab report writing', 'Science fair projects', 'How it applies outside class'], ['gary']),
    ('coding', 'Coding', 'Coding', 'How to think like a computer scientist, by building apps, games and small tools.',
     'Writing first programs, then structuring larger ones, then solving the algorithm problems used in programming contests.',
     ['Python, Java and C++', 'HTML, CSS and JavaScript', 'Algorithmic thinking', 'USACO and competitive programming', 'Creative coding and AI basics'], ['victor']),
    ('music', 'Music', 'Music', 'Lessons and theory from officers who have played for years, from first notes to a recital.',
     'Technique on the instrument, reading and writing music, and preparing a piece to the point where it can be performed.',
     ['Piano and keyboard', 'Violin, viola and flute', 'Guitar, acoustic and electric', 'Music theory and composition', 'Performance preparation'], ['gary']),
    ('social-studies', 'Social Studies', 'History', 'History, geography and civics: the stories behind how the world got this way.',
     'Events and the reasons behind them, how places and cultures shape each other, how government works, and how to research and present any of it.',
     ['US and world history', 'Geography and cultures', 'Government and civics', 'Research and presentations', 'Current events'], []),
    ('beyond', 'Beyond the Classroom', 'Beyond', 'Skills that help in every class, and a few that go past school altogether.',
     'Planning a week of homework, making art, thinking several moves ahead at the chessboard, and getting ready for the college years.',
     ['Study skills and organization', 'Digital art and design', 'Chess', 'College prep and planning', 'Confidence and life skills'], []),
]
OPTIONS = ''.join(f'<option value="{s[0]}">{s[1]}</option>' for s in SUBJECTS)

OFFICERS = [
    ('leon', 'Co-President', 'Hello, I am Leon Zhang. I am a video game designer, and I believe that everything we learn, whether it is writing, drawing, composing or more, can be combined into an experience everybody across the world can enjoy.'),
    ('victor', 'Co-President', 'Victor Pan is a junior at Syosset High School with a passion for swimming and technology. He is an AI enthusiast who designs and codes AI applications, combining creativity with technical skill to explore the future of intelligent software.'),
    ('lucille', 'Secretary', 'Lucille Lin is the secretary of Eternal Growth.'),
    ('mike', 'Treasurer', 'Mike Lu is a treasurer of Eternal Growth.'),
    ('alan', 'Treasurer', 'Alan Chen is a treasurer of Eternal Growth.'),
    ('kehan', 'Social Media Manager', 'Kehan Ying runs social media for Eternal Growth.'),
]
FOUNDERS = [
    ('gary', 'Founder', 'Gary Han is a researcher, violist and community leader from Syosset, NY. A 2025 Regeneron ISEF Grand Award winner and YoungArts National Winner in Classical Music, he has discovered new exocomets with deep learning, performed as principal violist at Juilliard Pre-College, and founded nonprofits bringing STEM and music education to underserved students.'),
    ('albert', 'Founder', 'Albert is studying Business Administration at the Tepper School of Business at Carnegie Mellon University, class of 2029. At Syosset High School he was an active member of the DECA club.'),
    ('andrew', 'Founder', 'Andrew is a freshman at RPI studying aerospace engineering, and likes anything to do with flying or driving. At Syosset High School he helped create Eternal Growth and tutored math, reading and an introduction to computer-aided design. He hopes to work on helicopters or supersonic commercial travel.'),
]

# former officers, shown on the Team page under Alumni
ALUMNI = [
    ('katherine', 'Vice President'), ('jack', 'Webmaster'), ('eliot', 'Director of STEM'), ('robert', 'Director of Humanities'),
    ('sue', 'Director of Fine Arts'), ('vincent', 'Director of Sports'), ('sam', 'Secretary of Membership'),
    ('isaac', 'Secretary of Outreach'), ('austin', 'Treasurer'),
]
