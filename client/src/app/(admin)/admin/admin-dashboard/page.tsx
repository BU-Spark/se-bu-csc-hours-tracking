import PendingCard from './components/PendingCard';
import PendingCori from './components/PendingCori';
import FeedbackCard from './components/FeedbackCard';
import prisma from '@/lib/prisma';
import VolunteerChart from './components/VolunteerChart';
import VolunteerGraph from './components/VolunteerGraph';
import './dashboard.css';

export default async function Dashboard() {
  const people = await prisma.person.findMany({
    take: 4,
    where: {
      role: 'ORGANIZER',
    },
    include: {
      affiliation: true,
    },
  });

  const mockEventData = [
    {
      title: 'Student Food Rescue',
      date: '03/25/2024',
      description:
        '“I really loved my interaction with Chef Pam. She provided us very clear guidelines to follow and to communicate with the people who came to the food pantry”',
      imageLink: 'https://picsum.photos/400/200',
      authorImg: 'https://i.pravatar.cc/40?img=',
    },
    {
      title: 'Alternate service break',
      date: '03/25/2024',
      description:
        '“I really loved my interaction with Chef Pam. She provided us very clear guidelines to follow and to communicate with the people who came to the food pantry”',
      imageLink: 'https://picsum.photos/400/200',
      authorImg: 'https://i.pravatar.cc/40?img=',
    },
  ];

  return (
    <>
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="section-header">
        <strong className="section-title">Pending Hour Approvals</strong>
        <button className="view-all-button">View All →</button>
      </div>

      <div className="card-row">
        {people.map((person, index) => (
          <PendingCard
            key={person.id}
            classYear={person.class || 2026}
            college={person.college || 'CAS'}
            name={
              person.name === 'Please Update Your Name'
                ? 'John Doe'
                : person.name
            }
            category={person.affiliation?.abbreviation || 'N/A'}
            hours={4}
            date={'03/25/2024'}
            profilePic={person.image || ''}
          />
        ))}
      </div>

      <div className="section-header mt-section-gap">
        <strong className="section-title">Pending CORI / Volunteer Agreement Approvals</strong>
        <button className="view-all-button">View All →</button>
      </div>

      <div className="card-row">
        {people.map((person, index) => (
          <PendingCori
            key={person.id + '-cori'}
            classYear={person.class || 2026}
            college={person.college || 'CAS'}
            name={
              person.name === 'Please Update Your Name'
                ? 'John Doe'
                : person.name
            }
            category={person.affiliation?.abbreviation || 'N/A'}
            dateRequested={'03/25/2024'}
            profilePic={`https://i.pravatar.cc/40?img=${index + 1}`}
          />
        ))}
      </div>

      <div className="grid-row">
        <div className="feedback-section">
          <strong className="section-title">Event Feedback</strong>
          {mockEventData.map((event, index) => (
            <FeedbackCard
              key={index}
              title={event.title}
              date={event.date}
              description={event.description}
              imageLink={event.imageLink}
              authorImg={event.authorImg + (index + 1)}
            />
          ))}
        </div>

        <div>
          <strong className="section-title">Student Volunteer Hours</strong>
          <VolunteerChart />
        </div>

        <div>
          <strong className="section-title"># Of Student Volunteers</strong>
          <VolunteerGraph />
        </div>
      </div>
    </>
  );
}