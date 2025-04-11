import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { Users } from './user-list/users';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockUsers: Users[] = [
      {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '123-456-7890',
        website: 'test.example.com',
        address: {
          street: 'Test Street',
          suite: 'Suite 101',
          city: 'Test City',
          zipcode: '12345',
          geo: {
            lat: '40.7128',
            lng: '-74.0060'
          }
        },
        company: {
          name: 'Test Company',
          catchPhrase: 'Test catchphrase',
          bs: 'Test bs'
        }
      }
    ];

    service.fetchUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service.API_URL}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch a single user by ID', () => {
    const mockUser: Users = {
      id: 1,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '123-456-7890',
      website: 'test.example.com',
      address: {
        street: 'Test Street',
        suite: 'Suite 101',
        city: 'Test City',
        zipcode: '12345',
        geo: {
          lat: '40.7128',
          lng: '-74.0060'
        }
      },
      company: {
        name: 'Test Company',
        catchPhrase: 'Test catchphrase',
        bs: 'Test bs'
      }
    };

    service.fetchUser(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service.API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
