import PendingCard from './components/PendingCard';
import PendingCori from './components/PendingCori';
import FeedbackCard from './components/FeedbackCard';
import prisma from '@/lib/prisma';
import VolunteerChart from './components/VolunteerChart';
import VolunteerGraph from './components/VolunteerGraph'; 

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

  //no event feedback data in prisma, going to have to be implemented in future
  //Using mock data in the meantime for UI/UX purposes
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
      <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)' }}>Dashboard</h1>

      <div style={{ marginTop: '4em', display: 'flex' }}>
        <strong style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
          Pending Hour Approvals
        </strong>
        <button
          style={{
            background: 'none',
            border: 'none',
            marginLeft: 'auto',
            fontWeight: 'bold',
            color: '#CC0000',
            cursor: 'pointer',
          }}
        >
          View All →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
        {/*Map over the people in database */}
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

      <div style={{ marginTop: '2.5em', display : 'flex' }}>
        <strong style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
          Pending CORI / Volunteer Agreement Approvals
        </strong>
        <button
          style={{
            background: 'none',
            border: 'none',
            marginLeft: 'auto',
            fontWeight: 'bold',
            color: '#CC0000',
            cursor: 'pointer',
          }}
        >
          View All →
        </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
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

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '2.5em',
          gap: '3em',
        }}
      >
        <div style={{ maxWidth: '25rem' }}>
          <strong style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
            Event Feedback
          </strong>
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
          <strong style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
            Student Volunteer Hours
          </strong>

          <VolunteerChart/>
        </div>

        <div>
          <strong style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
            # Of Student Volunteers
          </strong>
          <VolunteerGraph/>
        </div>
      </div>
    </>
  );
}