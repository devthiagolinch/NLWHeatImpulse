import { api } from '../../services/api';

import styles from './styles.module.scss';
import { VscGithubInverted} from 'react-icons/vsc'
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';

export function LoginBox() {  
  const { signinGitHub } = useContext(AuthContext);

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua menssagem</strong>
      <a href={signinGitHub} className={styles.signInWithGitHub} >
        <VscGithubInverted size={24} />
        Entrar com GitHub
      </a>
    </div>
  )
}