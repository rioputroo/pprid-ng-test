import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { UserListComponent } from './user-list.component';
import { UserStoreService } from '../user-store.service';
import { Users } from './users';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userStoreServiceMock: jasmine.SpyObj<UserStoreService>;
  let usersSubject: BehaviorSubject<Users[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let queryParamMap = new BehaviorSubject(convertToParamMap({ search: '' }));

  const mockUsers: Users[] = [
    {
      id: 1,
      name: 'Test User 1',
      username: 'testuser1',
      email: 'test1@example.com',
      phone: '123-456-7890',
      website: 'test1.example.com',
      address: {
        street: 'Test Street 1',
        suite: 'Suite 101',
        city: 'Test City 1',
        zipcode: '12345',
        geo: {
          lat: '40.7128',
          lng: '-74.0060'
        }
      },
      company: {
        name: 'Test Company 1',
        catchPhrase: 'Test catchphrase 1',
        bs: 'Test bs 1'
      }
    },
    {
      id: 2,
      name: 'Test User 2',
      username: 'testuser2',
      email: 'test2@example.com',
      phone: '123-456-7891',
      website: 'test2.example.com',
      address: {
        street: 'Test Street 2',
        suite: 'Suite 202',
        city: 'Test City 2',
        zipcode: '12346',
        geo: {
          lat: '34.0522',
          lng: '-118.2437'
        }
      },
      company: {
        name: 'Test Company 2',
        catchPhrase: 'Test catchphrase 2',
        bs: 'Test bs 2'
      }
    }
  ];

  beforeEach(async () => {
    usersSubject = new BehaviorSubject<Users[]>([]);
    loadingSubject = new BehaviorSubject<boolean>(true);

    userStoreServiceMock = jasmine.createSpyObj('UserStoreService', ['loadUsers'], {
      users$: usersSubject.asObservable(),
      loading$: loadingSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserStoreService, useValue: userStoreServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ search: '' }),
            queryParamMap: queryParamMap.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUsers on init', () => {
    expect(userStoreServiceMock.loadUsers).toHaveBeenCalled();
  });

  it('should show loading state initially', () => {
    expect(component.isLoading).toBeTrue();
    const loadingElement = fixture.nativeElement.querySelector('.loading-container');
    expect(loadingElement).toBeTruthy();
  });

  it('should update users when userStore emits users', () => {
    usersSubject.next(mockUsers);
    fixture.detectChanges();

    expect(component.users.length).toBe(2);
    expect(component.users[0].name).toBe('Test User 1');
  });

  it('should update loading state when userStore emits loading status', () => {
    expect(component.isLoading).toBeTrue();

    loadingSubject.next(false);
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
  });

  it('should filter users correctly based on search query', () => {
    usersSubject.next(mockUsers);
    fixture.detectChanges();

    expect(component.filteredUsers.length).toBe(2);

    component.searchQuery = 'User 1';
    component.filterUsers();
    fixture.detectChanges();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Test User 1');
  });

  it('should update searchQuery when URL query params change', () => {
    usersSubject.next(mockUsers);
    fixture.detectChanges();

    const activatedRouteMock = TestBed.inject(ActivatedRoute);
    Object.defineProperty(activatedRouteMock, 'queryParams', {
      get: () => of({ search: 'test2' })
    });

    component.searchQuery = 'test2';
    component.filterUsers();
    fixture.detectChanges();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].id).toBe(2);
    expect(component.filteredUsers[0].name).toBe('Test User 2');
  });

  it('should show empty state when no users match search query', () => {
    usersSubject.next(mockUsers);
    loadingSubject.next(false);
    fixture.detectChanges();

    component.searchQuery = 'nonexistent';
    component.filterUsers();
    fixture.detectChanges();

    expect(component.filteredUsers.length).toBe(0);

    const emptyElement = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyElement).toBeTruthy();
  });
});
