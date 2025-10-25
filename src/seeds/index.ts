import { classesSeed } from './classes.seed';
import { superAdminSeed } from './super-admin.seed';
import { userSeed } from './user.seed';

const seeds = async () => {
    await superAdminSeed();
    await classesSeed();
    await userSeed();
}

seeds();
