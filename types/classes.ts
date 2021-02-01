import firebase from 'firebase';

export type Classes = {
  name: string;
  school: string;
  belong: string;
  time: string;
  createdAt: firebase.firestore.Timestamp;
};
