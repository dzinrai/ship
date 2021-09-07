import Button from 'components/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from 'resources/user/user.slice';

import styles from './home.styles.pcss';

const meetings = [
  {
    time: '08:00 AM',
    description: 'Discussion of the attack strategy',
    participants: [
      'Obi-Wan Kenobi',
      'Luke Skywalker',
    ],
  },
  {
    time: '11:00 AM',
    description: 'Family meeting to discuss disagreements',
    participants: [
      'Anakin Skywalker',
      'Luke Skywalker',
    ],
  },
  {
    time: '02:00 PM',
    description: 'Attack on Death Star',
    participants: [
      'Luke Skywalker',
      'Han Solo',
    ],
  },
];

function Home() {
  const dispatch = useDispatch();

  async function test() {
    await dispatch(userActions.test({ email: 'NEWSS' }));
  }
  return (
    <>
      <h1 className={styles.title}>Meetings</h1>
      <Button onClick={test}>KEK</Button>
      <div>
        {meetings.map((meeting) => (
          <div
            key={meeting.description}
            className={styles.meeting}
          >
            <div className={styles.time}>
              {meeting.time}
            </div>

            <div className={styles.description}>
              {meeting.description}
            </div>

            <h3 className={styles.participantsTitle}>
              Participants:
            </h3>
            <ul className={styles.participantsList}>
              {meeting.participants.map((participator) => (
                <li key={participator}>
                  {participator}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default React.memo(Home);
