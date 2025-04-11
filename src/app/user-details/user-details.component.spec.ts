import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

import { UserDetailsComponent } from './user-details.component';
import { UserStoreService } from '../user-store.service';
import { Users } from '../user-list/users';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userStoreServiceMock: jasmine.SpyObj<UserStoreService>;
  let selectedUserSubject: BehaviorSubject<Users | null>;
  let loadingSubject: BehaviorSubject<boolean>;
  let activatedRouteMock: any;

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

  beforeEach(async () => {
    selectedUserSubject = new BehaviorSubject<Users | null>(null);
    loadingSubject = new BehaviorSubject<boolean>(true);

    userStoreServiceMock = jasmine.createSpyObj('UserStoreService', ['loadUser'], {
      selectedUser$: selectedUserSubject.asObservable(),
      loading$: loadingSubject.asObservable()
    });

    activatedRouteMock = {
      snapshot: {
        params: {
          id: '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: UserStoreService, useValue: userStoreServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUser with correct ID on init', () => {
    expect(userStoreServiceMock.loadUser).toHaveBeenCalledWith(1);
  });

  it('should show loading state initially', () => {
    expect(component.isLoading).toBeTrue();
    const loadingElement = fixture.nativeElement.querySelector('.loading-container');
    expect(loadingElement).toBeTruthy();
  });

  it('should update selectedUser when userStore emits user data', () => {
    expect(component.user).toBeNull();

    selectedUserSubject.next(mockUser);
    fixture.detectChanges();

    expect(component.user).toEqual(mockUser);
    expect(component.user?.name).toBe('Test User');
  });

  it('should update loading state when userStore emits loading status', () => {
    expect(component.isLoading).toBeTrue();

    loadingSubject.next(false);
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
  });

  it('should display user details when user data is loaded and loading is false', () => {
    selectedUserSubject.next(mockUser);
    loadingSubject.next(false);
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('.user-name');
    expect(nameElement).not.toBeNull('User name element should exist');
    expect(nameElement.textContent).toContain('Test User');
    const detailValues = fixture.nativeElement.querySelectorAll('.detail-value');
    expect(detailValues.length).toBeGreaterThan(0, 'Detail elements should exist');

    let hasEmail = false;
    detailValues.forEach((element: Element) => {
      if (element.textContent && element.textContent.includes('test@example.com')) {
        hasEmail = true;
      }
    });
    expect(hasEmail).toBeTrue();

    let hasCompany = false;
    detailValues.forEach((element: Element) => {
      if (element.textContent && element.textContent.includes('Test Company')) {
        hasCompany = true;
      }
    });
    expect(hasCompany).toBeTrue();
  });

  it('should have a back button that links to the user list', () => {
    const backButton = fixture.nativeElement.querySelector('a[routerLink="/"]');
    expect(backButton).toBeTruthy();
    expect(backButton.textContent).toContain('Back to User List');
  });
});
